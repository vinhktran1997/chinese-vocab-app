import { useLocation, useNavigate } from 'react-router-dom';

export default function ReviewResult() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate('/review');
    return null;
  }

  const { remembered, forgotten, hskLevel } = state;
  const total = remembered + forgotten;
  const accuracy = Math.round((remembered / total) * 100);

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <div className="card bg-base-100 shadow-xl p-8 flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold">Kết Quả Ôn Tập</h2>

        <div
          className="radial-progress text-primary text-2xl font-bold"
          style={{ '--value': accuracy, '--size': '8rem' }}
        >
          {accuracy}%
        </div>
        <div className="stats stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-title">Nhớ Được</div>
            <div className="stat-value text-success">{remembered}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Không Nhớ</div>
            <div className="stat-value text-success">{forgotten}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Tổng</div>
            <div className="stat-value text-success">{total}</div>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button
            className="btn btn-outline flex-1"
            onClick={() => navigate(`/review?hskLevel=${hskLevel}`)}
          >
            Ôn Tiếp
          </button>
          <button
            className="btn btn-primary flex-1"
            onClick={() => navigate('/')}
          >
            Kết Thúc
          </button>
        </div>
      </div>
    </div>
  );
}
