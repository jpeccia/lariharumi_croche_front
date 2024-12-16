import { useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import { reviewsApi } from '../../services/api';

interface ReviewFormProps {
  productId: number;
  onSuccess: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await reviewsApi.addReview(productId, data);
      reset();
      onSuccess();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Avaliação</label>
        <div className="flex gap-2 mt-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating} className="cursor-pointer">
              <input
                type="radio"
                value={rating}
                {...register('rating', { required: true })}
                className="hidden"
              />
              <Star
                className={`w-6 h-6 ${
                  rating <= Number(register('rating').value)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Comentário</label>
        <textarea
          {...register('comment', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        Enviar Avaliação
      </button>
    </form>
  );
}