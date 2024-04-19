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


    return (
        <div>
        <button onClick={openModal}>Открыть модальное окно</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-row">
                    <label>Стенд</label>
                    <label>Дата</label>
                    <label>Время начала</label>
                    <label>Длительность</label>
                </div>
                <div className="form-row">
                    <input type="text" name="stand" value={formData.stand} onChange={handleChange} />
                    <input type="text" name="date" value={formData.date} onChange={handleChange} />
                    <input type="text" id="timeInput" className="timeInput" placeholder="__:__" maxlength="5" onChange={handleChange} />
                    <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
                </div>
                <div className="form-row">
                <Button style={"UserAdd"} type={"submit"}> Войти </Button>
                <Button style={"userDelete"} onClick={closeModal}> Закрыть </Button>
                </div>
                <div className="form-row">
                    {/* <span id="error-message" style="color: red;"></span> */}
                </div>
            </form>
        </Modal>
      </div>
    );
  
}
