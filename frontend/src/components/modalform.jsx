import { useState, useEffect } from "react";

export default function ModalForm({ isOpen, onClose, mode, onSubmit, workerData }) {
  const [rate, setRate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [job, setJob] = useState('');
  const [status, setStatus] = useState(false);
  const [error, setError] = useState('');

  const handleStatusChange = (e) => {
    setStatus(e.target.value === 'Active');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !rate) {
      setError("Поля name, email и rate обязательны");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Неверный формат email");
      return;
    }

    const numericRate = Number(rate);
    if (isNaN(numericRate) || numericRate < 0 || numericRate > 100) {
      setError("Rate должен быть числом от 0 до 100");
      return;
    }

    try {
      const workerDataToSubmit = {
        name,
        email,
        job,
        rate: numericRate,
        isactive: status,
      };
      await onSubmit(workerDataToSubmit);
      onClose();
    } catch (err) {
      setError(err.message || "Ошибка добавления работника");
    }
  };

  useEffect(() => {
    if (mode === 'edit' && workerData) {
      setName(workerData.name || '');
      setEmail(workerData.email || '');
      setJob(workerData.job || '');
      setRate(workerData.rate || '');
      setStatus(workerData.isactive ?? false);
      setError('');
    } else {
      setName('');
      setEmail('');
      setJob('');
      setRate('');
      setStatus(false);
      setError('');
    }
  }, [mode, workerData]);

  return (
    <dialog id="my_modal_3" className="modal bg-black/40" open={isOpen}>
      <div className="modal-box">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
        <h3 className="font-bold text-lg py-4">{mode === 'edit' ? 'Edit Worker' : 'Worker Details'}</h3>

        <form method="dialog" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          <label className="input input-bordered flex items-center my-4 gap-2">
            Name
            <input
              type="text"
              className="grow"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center my-4 gap-2">
            Email
            <input
              type="email"
              className="grow"
              placeholder="Емайл"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center my-4 gap-2">
            Job
            <input
              type="text"
              className="grow"
              placeholder="Должность"
              value={job}
              onChange={(e) => setJob(e.target.value)}
            />
          </label>

          <div className="flex mb-4 justify-between">
            <label className="input input-bordered flex mr-4 items-center gap-2">
              Rate
              <input
                type="number"
                className="grow"
                placeholder="0-100"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="0"
                max="100"
              />
            </label>

            <select
              value={status ? 'Active' : 'Inactive'}
              className="select select-bordered mr-40 w-full max-w-xs"
              onChange={handleStatusChange}
            >
              <option>Inactive</option>
              <option>Active</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success">
            {mode === 'edit' ? 'Save Changes' : 'Add Worker'}
          </button>
        </form>
      </div>
    </dialog>
  );
}
