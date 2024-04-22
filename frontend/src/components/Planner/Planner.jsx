import React, { useState, Component } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import './Planner.css'

export default function Planner() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [formData, setFormData] = useState({
        stand: '',
        date: '',
        startTime: '',
        duration: ''
      });

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      // Обработка данных формы
      console.log(formData);
      closeModal()
    }


    const [startTime, setValue] = useState('');

    const handleT = (e) => {
      let inputValue = e.target.value;
  
      // Удаляем все нецифровые символы
      inputValue = inputValue.replace(/\D/g, '');
  
      // Добавляем двоеточие после первых двух цифр
      if (inputValue.length >= 2) {
        inputValue = inputValue.substring(0, 2) + ':' + inputValue.substring(2);
      }
  
      // Обрезаем строку до максимально допустимой длины "HH:MM"
      if (inputValue.length > 5) {
        inputValue = inputValue.substring(0, 5);
      }
      setValue(inputValue); 
    }

    return (
        <div>
        <button onClick={openModal}>Открыть модальное окно</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-row">
                    <label>Стенд</label>
                    <input type="text" name="stand" className="timeInput" value={formData.stand} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Дата</label>
                    <input type="text" name="date" className="timeInput" value={formData.date} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Время начала</label>
                    <input type="text" id="timeInput" className="timeInput" placeholder="hh:mm" maxlength="5" onChange={handleT} value={startTime}/>
                </div>
                <div className="form-row">
                <label>Длительность</label>
                    <input type="text" name="duration" className="timeInput" value={formData.duration} onChange={handleChange} />
                </div>
                {/* <div className="form-row">
                    <label>Стенд</label>
                    <label>Дата</label>
                    <label>Время начала</label>
                    <label>Длительность</label>
                </div>
                <div className="form-row">
                    <input type="text" name="stand" value={formData.stand} onChange={handleChange} />
                    <input type="text" name="date" value={formData.date} onChange={handleChange} />
                    <input type="text" id="timeInput" className="timeInput" placeholder="hh:mm" maxlength="5" onChange={handleT} value={startTime}/>
                    <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
                </div> */}
                <div className="form-row">
                <Button style={"reservation.add"} type={"submit"}> Создать </Button>
                <Button style={"reservationExit"} onClick={closeModal}> Закрыть </Button>
                </div>
                <div className="form-row">
                    {/* <span id="error-message" style="color: red;"></span> */}
                </div>
            </form>
        </Modal>
      </div>
    );
  
}
