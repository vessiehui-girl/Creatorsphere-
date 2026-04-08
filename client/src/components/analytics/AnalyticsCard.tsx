interface AnalyticsCardProps {
  platform: string;
  views: number;
  likes: number;
  comments: number;
}

export default function AnalyticsCard({ platform, views, likes, comments }: AnalyticsCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">
      <h3 className="text-white font-semibold">{platform}</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-blue-400 font-bold text-lg">{views.toLocaleString()}</p>
          <p className="text-gray-400 text-xs">Views</p>
        </div>
        <div>
          <p className="text-pink-400 font-bold text-lg">{likes.toLocaleString()}</p>
          <p className="text-gray-400 text-xs">Likes</p>
        </div>
        <div>
          <p className="text-green-400 font-bold text-lg">{comments.toLocaleString()}</p>
          <p className="text-gray-400 text-xs">Comments</p>
        </div>
      </div>
    </div>
  );
}
