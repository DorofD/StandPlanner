import React, { useState, Component } from "react";
import Modal from "../Modal/Modal";

export default function Planner() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <div>
        <button onClick={openModal}>Открыть модальное окно</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Модальное окно 22222222222222222222222222</h2>
          <p>Здесь может быть ваша форма...</p>
          <p>Здесь может быть ваша форма...</p>
          <p>Здесь может быть ваша форма...</p>
          <p>Здесь может быть ваша форма...</p>
          <p>Здесь может быть ваша форма...</p>
          <button onClick={closeModal}>Закрыть</button>
        </Modal>
      </div>
    );
  
}
