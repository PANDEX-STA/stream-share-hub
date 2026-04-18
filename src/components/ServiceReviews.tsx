import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  author_name: string | null;
  created_at: string;
}

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .min(3, "El comentario debe tener al menos 3 caracteres")
    .max(1000, "Máximo 1000 caracteres"),
});

interface Props {
  serviceSlug: string;
  serviceName: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const StarRating = ({
  value,
  onChange,
  size = "w-5 h-5",
}: {
  value: number;
  onChange?: (n: number) => void;
  size?: string;
}) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(n)}
        className={`${onChange ? "cursor-pointer" : "cursor-default"} p-0.5`}
        aria-label={`${n} estrellas`}
      >
        <Star
          className={`${size} ${
            n <= value
              ? "fill-accent text-accent"
              : "text-muted-foreground/40"
          }`}
        />
      </button>
    ))}
  </div>
);

const ServiceReviews = ({ serviceSlug, serviceName }: Props) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("id, user_id, rating, comment, author_name, created_at")
      .eq("service_slug", serviceSlug)
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("No se pudieron cargar las reseñas");
    } else {
      setReviews(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setAuthorName(data.full_name);
      });
  }, [user]);

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = reviewSchema.safeParse({ rating, comment });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").upsert(
      {
        user_id: user.id,
        service_slug: serviceSlug,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        author_name: authorName.trim() || null,
      },
      { onConflict: "user_id,service_slug" },
    );
    setSubmitting(false);
    if (error) {
      toast.error("No se pudo guardar tu reseña");
      return;
    }
    toast.success(myReview ? "Reseña actualizada" : "¡Gracias por tu reseña!");
    setComment("");
    await load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      toast.error("No se pudo eliminar");
      return;
    }
    toast.success("Reseña eliminada");
    await load();
  };

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="py-12">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Reseñas de <span className="text-gradient">{serviceName}</span>
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating value={Math.round(avg)} />
              <span className="text-sm text-muted-foreground">
                {avg.toFixed(1)} · {reviews.length} reseña
                {reviews.length === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-card border border-border rounded-2xl p-5 mb-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {myReview ? "Edita tu reseña" : "Deja tu reseña"}
            </label>
            <StarRating value={rating} onChange={setRating} size="w-7 h-7" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Mostrar como (opcional)
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={60}
              placeholder="Tu nombre o iniciales"
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Tu comentario
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder={
                myReview
                  ? "Actualiza tu opinión sobre el servicio"
                  : "Cuéntanos tu experiencia con este servicio"
              }
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm focus:outline-none focus:border-primary/40 resize-none"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/1000
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {myReview ? "Actualizar reseña" : "Publicar reseña"}
          </button>
        </form>
      ) : (
        <div className="bg-secondary/40 border border-border rounded-2xl p-5 mb-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Solo los usuarios registrados pueden dejar reseñas reales. No se
            permiten comentarios anónimos.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm"
          >
            Inicia sesión para reseñar
          </Link>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="text-center text-muted-foreground py-8">
          <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
          Cargando reseñas...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-muted-foreground py-8 border border-dashed border-border rounded-2xl">
          Aún no hay reseñas para este servicio. ¡Sé el primero en opinar!
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="bg-gradient-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-2 gap-3">
                <div>
                  <p className="font-semibold text-foreground">
                    {r.author_name || "Usuario"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating value={r.rating} size="w-4 h-4" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(r.created_at)}
                    </span>
                  </div>
                </div>
                {user?.id === r.user_id && (
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                    aria-label="Eliminar reseña"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-secondary-foreground whitespace-pre-line">
                {r.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ServiceReviews;
