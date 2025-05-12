import { useState, useEffect } from 'react';
import './index.css';
import ModalForm from './components/modalform';
import Navbar from './components/navbar';
import Tablet from './components/tablet';
import axios from 'axios';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [workerData, setWorkerData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/workers');
        const sortedData = response.data.sort((a, b) => a.id - b.id); 
        setTableData(sortedData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleOpen = (mode, worker) => {
    setWorkerData(worker);
    setIsOpen(true);
    setModalMode(mode);
  };

  const handleStatusChange = () => {
    const updatedWorker = { ...workerData, isactive: !workerData.isactive };
    setWorkerData(updatedWorker);
  };

  const handleSubmit = async (newWorkerData) => {
    const dataToSend = {
      ...newWorkerData,
      isactive: newWorkerData.isactive !== undefined ? newWorkerData.isactive : true,
    };

    if (modalMode === 'add') {
      try {
        const response = await axios.post('http://localhost:5000/api/workers', dataToSend);
        setTableData((prevData) => {
          const updatedData = [...prevData, response.data];
          return updatedData.sort((a, b) => a.id - b.id);
        });
      } catch (err) {
        console.error('Ошибка добавления работника:', err);
      }
    } else {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/workers/${workerData.id}`,
          dataToSend
        );
        setTableData((prevData) =>
          prevData
            .map((worker) =>
              worker.id === workerData.id ? response.data : worker
            )
            .sort((a, b) => a.id - b.id)
        );
      } catch (err) {
        console.error('Ошибка обновления работника:', err);
      }
    }
  };

  const filteredData = tableData.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.job.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = filteredData.filter(w => w.isactive).length;
  const averageRating = filteredData.length > 0
    ? (filteredData.reduce((sum, w) => sum + Number(w.rate || 0), 0) / filteredData.length).toFixed(2)
    : '0.00';

  return (
    <>
      <Navbar
        onOpen={() => handleOpen('add')}
        onSearch={setSearchTerm}
        activeCount={activeCount}
        averageRating={averageRating}
      />

      <Tablet
        handleOpen={handleOpen}
        searchTerm={searchTerm}
        tableData={tableData}
        setTableData={setTableData}
        error={error}
        setError={setError}
      />

      <ModalForm
        isOpen={isOpen}
        onSubmit={handleSubmit}
        onClose={() => setIsOpen(false)}
        mode={modalMode}
        workerData={workerData}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}

export default App;
