import React from 'react';
import { MessageSquare, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { Review } from '../../types/user';

export function ReviewManagement() {
  const [reviews, setReviews] = React.useState<Review[]>([]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-purple-500" />
        <h2 className="text-xl font-semibold text-purple-800">Gerenciar Avaliações</h2>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-purple-800">{review.user.name}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{review.rating}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-md">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}