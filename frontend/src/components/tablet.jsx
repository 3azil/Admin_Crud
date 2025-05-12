import axios from 'axios';

export default function Tablet({ handleOpen, searchTerm, tableData, setTableData, error, setError }) {

  const filteredData = tableData.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.job.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Вы уверены что хотите удалить пользователя?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/workers/${id}`);
        setTableData((prevData) => prevData.filter(worker => worker.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const activeCount = filteredData.filter(worker => worker.isactive).length;
  const averageRating =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, w) => sum + Number(w.rate || 0), 0) / filteredData.length
        ).toFixed(2)
      : '0.00';

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>}

     

      <div className="overflow-x-auto mt-6">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Почта</th>
              <th>Должность</th>
              <th>Рейтинг</th>
              <th>Статус</th>
              <th>Действия:</th>
            </tr>
          </thead>
          <tbody className="hover">
            {filteredData.map((worker) => (
              <tr key={worker.id}>
                <td>{worker.id}</td>
                <td>{worker.name}</td>
                <td>{worker.email}</td>
                <td>{worker.job}</td>
                <td>{worker.rate}</td>
                <td>
                  <button className={`btn rounded-full w-20 ${worker.isactive ? 'btn-primary' : 'btn-outline text-blue-500 border-blue-500'}`}>
                    {worker.isactive ? 'Активный' : 'ᶻ 𝗓 𐰁 .ᐟ'}
                  </button>
                </td>
                <td className="flex gap-2">
                  <button onClick={() => handleOpen('edit', worker)} className="btn btn-sec">Обновить</button>
                  <button className="btn btn-accent" onClick={() => handleDelete(worker.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
