import React, { Component, useState, useEffect } from "react";
import "./Rocket.css"
import { apiGetRbotCheck, apiGetRbotStatus, apiGetRocketRooms, apiGetLocalRocketRooms, apiUpdateLocalRocketRooms, apiDeleteLocalRoom, apiLinkRoomsData } from "../../services/apiRocket";
import TimedMessages from "../TimedMessages/TimedMessages";
import RocketRoomCard from "./RocketRoomCard/RocketRoomCard";
import LocalRocketRoomCard from "./LocalRocketRoomCard/LocalRocketRoomCard";
import Loader from "../Loader/Loader";
import { useTimedMessagesContext } from "../../hooks/useTimedMessagesContext";
import AcceptModal from "../AcceptModal/AcceptModal";

export default function Rocket() {
    // 'success': True,
    // "hostname": hostname,
    // "uptime": uptime_str,
    // "now": now
    const [rbotCheck, setRbotCheck] = useState({})
    const [rbotStatus, setRbotStatus] = useState({})
    const [rocketRooms, setRocketRooms] = useState([])
    const [pickedRocketRoom, setPickedRocketRoom] = useState({ _id: 0 })
    const [pickedLocalRoom, setPickedLocalRoom] = useState({ id: 0 })
    const [localRocketRooms, setLocalRocketRooms] = useState([])
    const [loading, setLoading] = useState('loading')
    const [loaderActive, setLoaderActive] = useState(false)
    const { messages, addMessage } = useTimedMessagesContext();
    const [showHint, setShowHint] = useState(false);

    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [actionFunction, setActionFunction] = useState(null);
    const openAcceptModalWithAction = (action) => {
        setActionFunction(() => action);
        setIsAcceptModalOpen(true);
    };
    function closeAcceptModal() {
        setIsAcceptModalOpen(false);
    }

    async function getRbotCheck() {
        try {
            setLoading('loading')
            const rcheck = await apiGetRbotCheck()
            setRbotCheck(rcheck)
            setLoading('loaded')
        } catch (err) {
            setLoading('error')
        }
    }
    async function getRbotStatus() {
        try {
            setLoaderActive(true)
            const rstatus = await apiGetRbotStatus()
            setRbotStatus(rstatus)
            setLoaderActive(false)
        } catch (err) {
            setLoaderActive(false)
        }
    }

    async function getRocketRooms() {
        try {
            setLoaderActive(true)
            const rooms = await apiGetRocketRooms()
            setRocketRooms(rooms)
            setLoaderActive(false)
        } catch (err) {
            setLoaderActive(false)
        }
    }

    async function getLocalRocketRooms() {
        try {
            setLoaderActive(true)
            const rooms = await apiGetLocalRocketRooms()
            setLocalRocketRooms(rooms)
            setLoaderActive(false)
        } catch (err) {
            setLoaderActive(false)
        }
    }

    async function updateLocalRocketRooms() {
        setLoaderActive(true)
        const response = await apiUpdateLocalRocketRooms(rocketRooms)
        if (response.status == 200) {
            setLoaderActive(false)
            getLocalRocketRooms()
            addMessage('Локальные комнаты обновлены', 'success', 3000)
        } else {
            addMessage('Не удалось обновить локальные комнаты', 'error', 3000)
            setLoaderActive(false)
        }

    }

    async function linkRoomsData() {
        setLoaderActive(true)
        const response = await apiLinkRoomsData()
        if (response.status == 200) {
            setLoaderActive(false)
            getLocalRocketRooms()
            addMessage('Обработка завершена', 'success', 3000)
        } else {
            addMessage('Что-то пошло не так при обработке данных', 'error', 3000)
            setLoaderActive(false)
        }

    }

    async function deleteLocalRoom() {
        const response = await apiDeleteLocalRoom(pickedLocalRoom.id)
        if (response.status == 200) {
            getLocalRocketRooms()
            closeAcceptModal()
            addMessage('Комната удалена', 'success', 3000)

        } else {
            closeAcceptModal()
            addMessage('Не удалось удалить комнату', 'error', 3000)
        }
    }

    useEffect(() => {
        getRbotCheck()
    }, [])

    return (
        <div className="rocketMain">
            {loaderActive && <Loader />}
            <div className="rocketLeft">
                <div className="rocketLeft1">
                    {loading === 'loading' && <p> Loading ...</p>}
                    {loading === 'error' && <p> бекенд отвалился</p>}

                    {loading === 'loaded' && rbotCheck.success &&
                        <>
                            <div className="rocketMainTitle">Управление ботом и обработкой данных Rocket.Chat</div>
                            <div className="rocketParams">
                                <div className="rocketParamTitle">Текущий статус:</div>
                                <div className="rocketParam-row">
                                    <div className="rocketParam-key ">Bot instance</div>
                                    <div className="paramValue success-colors">{rbotCheck.success && "Online"}</div>
                                </div>
                                <div className="rocketParam-row">
                                    <div className="rocketParam-key">Hostname</div>
                                    <div>{rbotCheck.hostname}</div>
                                </div>
                                <div className="rocketParam-row">
                                    <div className="rocketParam-key">Uptime</div>
                                    <div> {rbotCheck.uptime}</div>
                                </div>
                                <div className="rocketParam-row">
                                    <div className="rocketParam-key">Current time</div>
                                    <div>{rbotCheck.now}</div>
                                </div>
                            </div>

                        </>}
                </div>
                <div className="rocketLeft2">
                    <div className="rocketLeft2Title">
                        Что делают кнопки
                        < button
                            onClick={() => {
                                setShowHint((prev) => !prev);
                            }} className={showHint ? "showHint picked" : "showHint"}>
                            ?
                        </button>
                    </div>
                    <div className="rocketLeft2Buttons">
                        <button onClick={() => { getRocketRooms(); getLocalRocketRooms() }}>
                            Загрузить комнаты
                        </button>
                        <button onClick={() => updateLocalRocketRooms()}>
                            Обновить состав комнат
                        </button>
                        <button onClick={() => linkRoomsData()}>
                            Связать данные
                        </button>
                        <button onClick={() => getRbotStatus()}>
                            Настройки бота
                        </button>
                    </div>
                </div>
                <div className="rocketLeft3">

                    <div className="rocketBotCurrentSettings">
                        {rbotStatus.success && !rbotStatus.current_settings.success &&
                            <>Боту не удалось применить настройки: {rbotStatus.current_settings.error}</>}
                        {rbotStatus.success && rbotStatus.current_settings.success && <div>{rbotStatus.current_settings.message}</div>}
                    </div>
                </div>
            </div>
            <div className="rocketCenter">
                <div className="rocketCenter1">
                </div>
                <div className="rocketCenter2">
                    {showHint &&
                        <div className="sourcesHint">
                            <div className="rocketHintBox">
                                <p ><strong>Загрузить комнаты</strong> - сервис выгружает комнаты, сохраненные в его базе данных, а также
                                    запрашивает у бота список всех комнат, которые он видит в Rocket.Chat</p>
                                <p><strong>Обновить состав комнат</strong> - сервис сохраняет отсутствующие локально комнаты из Rocket.Chat, и помечает как
                                    "Outdated" локальные, отсутствующие в Rocket.Chat. Данные комнат при этом не обновляются, сравнение происходит только по rid</p>
                                <p ><strong>Связать данные</strong> - для каждой локальной комнаты выполняется поиск данных, указывающих на её связь с
                                    определенным стендом. Если находятся признаки, явно указывающие на связь (например, описание комнаты указывает на Confluence PageId
                                    стенда или стенд содержит в вёрстке ссылку на эту комнату) - комнате присваевается uuid стенда.
                                </p>
                                <p ><strong>Зачем</strong> нужен функционал связки данных? Он нужен для автоматизации процесса обработки стендов и комнат,
                                    а также для избежания проблем некорректной обработки ввиду возможных опечаток сотрудников при
                                    создании комнат/статей Confluence
                                </p>

                            </div>
                        </div>}
                    {rocketRooms.length > 0 && <>
                        <b>Комнаты из Rocket.Chat</b>
                        {rocketRooms.map(room =>
                            <RocketRoomCard
                                id={room._id}
                                rid={room._id}
                                name={room.name || 'none'}
                                fname={room.fname || 'none'}
                                room_type={room.t}
                                announcement={room.announcement || 'none'}
                                picked={pickedRocketRoom._id === room._id}
                                // onClick={() => { setPickedRoom(room) }}
                                onClick={() => {
                                    if (pickedRocketRoom._id === room._id) {
                                        setPickedRocketRoom({ _id: 0 });
                                    } else {
                                        setPickedRocketRoom(room);
                                    }
                                }}
                            >
                            </RocketRoomCard>

                        )}</>}
                </div>
            </div>
            <div className="rocketRight">
                <div className="rocketRight1">
                </div>
                <div className="rocketRight2">

                    {localRocketRooms.length > 0 && <>
                        <b>Локальные комнаты</b>
                        {localRocketRooms.map(room =>
                            <LocalRocketRoomCard
                                id={room.id}
                                rid={room.rocket_id}
                                rocket_link={room.rocket_link || 'none'}
                                name={room.name || 'none'}
                                fname={room.fname || 'none'}
                                room_type={room.room_type}
                                description={room.description}
                                status={room.status}
                                updated_at={room.updated_at}
                                stand_uuid={room.stand_uuid || 'none'}
                                picked={pickedLocalRoom.id === room.id}
                                // onClick={() => { setPickedRoom(room) }}
                                onClick={() => {
                                    if (pickedLocalRoom.id === room.id) {
                                        setPickedLocalRoom({ id: 0 });
                                    } else {
                                        setPickedLocalRoom(room);
                                    }
                                }}
                                onClick2={() => openAcceptModalWithAction(deleteLocalRoom)}
                            >
                            </LocalRocketRoomCard>
                        )}</>}
                </div >
            </div>
            <AcceptModal isOpen={isAcceptModalOpen} onClose={closeAcceptModal}>
                <div className="acceptModal">
                    <div className="acceptModalText">
                        <p>Вы уверены?</p>
                    </div>
                    <div className="acceptModalButtons">
                        <button className={"positive acceptModal"} onClick={() => { actionFunction(); closeAcceptModal(); }}> Да </button>
                        <button className={"critical acceptModal"} onClick={closeAcceptModal}> Нет </button>
                    </div>
                </div>
            </AcceptModal>
        </div>

    );
}