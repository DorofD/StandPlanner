import React, { Component, useState, useEffect } from "react";
import "./Stands.css";
import StandCard from "./StandCard/StandCard";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import AcceptModal from "../AcceptModal/AcceptModal";
import { apiGetStands, apiGetStand, apiChangeStand, apiAddStand, apiDeleteStand } from "../../services/apiStands";

export default function Stands() {
    const { userName, userId } = useAuthContext();
    const { notificationData, setNotificationData, toggleNotificationFunc, notificationToggle } = useNotificationContext();
    const [loading, setLoading] = useState('start')

    const [newStand, setNewStand] = useState({ name: '', description: '' })
    const [stands, setStands] = useState([])
    const [pickedStand, setPickedStand] = useState({ id: '', name: '', source_type: '' })
    const [actionFunction, setActionFunction] = useState(null);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [loadedStand, setLoadedStand] = useState(false)
    const [isChanged, setIsChanged] = useState(false)



    const openAcceptModalWithAction = (action) => {
        setActionFunction(() => action);
        setIsAcceptModalOpen(true);
    };

    function closeAcceptModal() {
        setIsAcceptModalOpen(false);
    };

    async function getStands() {
        try {
            setLoading('loading')
            const loadedStands = await apiGetStands()
            setStands(loadedStands)
            setLoading('loaded')
        } catch (err) {
            setLoading('error')
        }
    }

    async function getStand(id) {
        try {
            const lStand = await apiGetStand(id)

            setLoadedStand(lStand)
            setIsChanged({ name: false, description: false })
        } catch (err) {
            setLoading('error')
        }
    }

    async function addStand() {
        if (!newStand['name'] || !newStand['description']) {
            setNotificationData({ message: 'Заполните доступные поля', type: 'error' })
            toggleNotificationFunc()
            return false
        }
        const response = await apiAddStand(newStand['name'], newStand['description'])
        if (response.status == 200) {
            setNewStand({ name: '', description: '' })
            setPickedStand({ id: '', name: '', description: '' })
            getStands()
            setNotificationData({ message: 'Стенд добавлен', type: 'success' })
            toggleNotificationFunc()

        } else {
            setNotificationData({ message: 'Не удалось добавить стенд', type: 'error' })
            toggleNotificationFunc()
        }
    }

    async function changeStand() {
        if (pickedStand.id !== loadedStand.id) {
            setNotificationData({ message: "Внутренняя ошибка: pickedStand.id !== loadedStand.id", type: 'error long' })
            toggleNotificationFunc()
            return 1
        }
        if (!isChanged.name && !isChanged.description) {
            setNotificationData({ message: "Внесите изменения, чтобы их применить", type: 'warning' })
            toggleNotificationFunc()
            return 1
        }
        let fields_to_update = {}
        if (isChanged.name) { fields_to_update.name = loadedStand.name }
        if (isChanged.description) { fields_to_update.description = loadedStand.description }
        const response = await apiChangeStand(pickedStand['id'], fields_to_update)
        if (response.status == 200) {
            getStands()
            setNotificationData({ message: 'Стенд изменён', type: 'success' })
            toggleNotificationFunc()

        } else {
            setNotificationData({ message: 'Не удалось изменить стенд', type: 'error' })
            toggleNotificationFunc()
        }
    }

    async function deleteStand() {
        const response = await apiDeleteStand(pickedStand['id'])
        if (response.status == 200) {
            getStands()
            setPickedStand({ id: '', name: '', description: '' })
            setNotificationData({ message: 'Стенд удалён', type: 'success' })
            toggleNotificationFunc()

        } else {
            setNotificationData({ message: 'Не удалось удалить стенд', type: 'error' })
            toggleNotificationFunc()
        }
    }
    useEffect(() => {
        getStands()
    }, [])

    return (
        <div className="stands">
            <div className="standsLeft">
                <div className="standsNotes">
                    {loading === 'loading' && <p> Loading ...</p>}
                    {loading === 'error' && <p> бекенд отвалился</p>}
                    {loading === 'loaded' && <>
                        {stands.map(stand =>
                            <StandCard id={stand.id}
                                name={stand.name}
                                picked={pickedStand['id'] === stand.id && true || false}
                                source_type={stand.source_type}
                                status={stand.status}
                                last_update={stand.stand_last}
                                onClick={() => { setNewStand({ name: '', description: '' }); setPickedStand(stand); getStand(stand.id) }}>
                            </StandCard>)}</>}
                </div>

            </div>
            <div className="standsRight">
                {loading === 'loading' && <p> Loading ...</p>}
                {loading === 'error' && <p> бекенд отвалился</p>}
                {loading === 'loaded' && <>
                    {stands && !pickedStand.id &&
                        <div className="standsManageStandWrapper">
                            <div className="standsManageStand">
                                <div className="standsManageStandTopLabel">Добавить новый стенд</div>
                                <input type="text"
                                    maxLength={100}
                                    placeholder='Название'
                                    className="manageStand newName"
                                    value={newStand.value}
                                    onChange={e => setNewStand({ ...newStand, name: e.target.value })}
                                />

                                <textarea name="newStand"
                                    maxLength={4000}
                                    placeholder='Описание'
                                    className="manageStand description"
                                    value={newStand.description}
                                    onChange={e => setNewStand({ ...newStand, description: e.target.value })}
                                >
                                </textarea>
                                <div className="standsManageStandButtons">
                                    <button onClick={() => { addStand() }}> Добавить </button>
                                </div>
                            </div>
                        </div>

                    }

                    {stands && pickedStand.id && loadedStand &&
                        <div className="standsManageStandWrapper changeStand">
                            <div className="standsManageStand">
                                <div className="standsManageStandTopLabel">Редактировать стенд</div>
                                <div className="changeStandParams">
                                    <input type="text"
                                        maxLength={100}
                                        placeholder='Название'
                                        className="manageStand name"
                                        value={loadedStand.name}
                                        onChange={e => {
                                            setLoadedStand({ ...loadedStand, name: e.target.value });
                                            setIsChanged({ ...isChanged, name: true })
                                        }}
                                    />
                                    {/* <div className="param-row">
                                        <div className="param-key">Name</div>
                                        <div>{pickedStand.name}</div>
                                    </div> */}
                                    <div className="param-row">
                                        <div className="param-key">Статус</div>
                                        <div>{pickedStand.status}</div>
                                    </div>
                                    <div className="param-row">
                                        <div className="param-key">Источник</div>
                                        <div>{pickedStand.source_type || "Отсутствует"}</div>
                                    </div>
                                    <div className="param-row">
                                        <div className="param-key">Последнее обновление</div>
                                        <div>{pickedStand.last_update === "never" && "Отсутствует" || pickedStand.last_update}</div>
                                    </div>
                                </div>
                                <textarea name="newStand"
                                    maxLength={4000}
                                    placeholder='Описание'
                                    className="manageStand description"
                                    value={loadedStand.description}
                                    onChange={e => {
                                        setLoadedStand({ ...loadedStand, description: e.target.value });
                                        setIsChanged({ ...isChanged, description: true });
                                    }}
                                >
                                </textarea>
                                <div className="standsManageStandButtons">
                                    <button onClick={() => { openAcceptModalWithAction(changeStand) }}> Применить изменения </button>
                                    <button onClick={() => { setPickedStand({ id: 0 }); setLoadedStand(false) }}> Отменить </button>
                                    <button className="standsDeleteButton" onClick={() => { openAcceptModalWithAction(deleteStand) }}> Удалить </button>
                                </div>
                            </div>
                        </div> || <></>
                    }
                </>}

            </div>
            <AcceptModal isOpen={isAcceptModalOpen} onClose={closeAcceptModal}>
                <div className="acceptModal">
                    <div className="acceptModalText">
                        <p>Вы уверены?</p>
                    </div>
                    <div className="acceptModalButtons">
                        <button className={"acceptModal positive"} onClick={() => { actionFunction(); closeAcceptModal(); }}> Да </button>
                        <button className={"acceptModal critical"} onClick={closeAcceptModal}> Нет </button>
                    </div>
                </div>
            </AcceptModal>
        </div>
    );
}