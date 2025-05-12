export default function Navbar({ onOpen, onSearch, activeCount, averageRating }) {
  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <>
      <div className="navbar bg-base-100 p-4">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">Работники</a>
        </div>

        <div className="navbar-center flex flex-col md:flex-row items-center gap-4">
          <div className="form-control">
            <input
              type="text"
              placeholder="Поиск"
              onChange={handleSearchChange}
              className="input input-bordered w-24 md:w-60"
            />
          </div>

          <div className="text-sm text-gray-500 text-center md:text-left ml-10">
            <p>👥 Активных: <span className="text-white font-semibold">{activeCount}</span></p>
            <p>📊 Средний рейтинг: <span className="text-white font-semibold">{averageRating}</span></p>
          </div>
        </div>

        <div className="navbar-end">
          <a className="btn btn-primary" onClick={onOpen}>Добавить Работника</a>
        </div>
      </div>
    </>
  );
}
