import React, { Component, useState, useEffect } from "react";
import "./Sources.css";
import SourceCard from "./SourceCard/SourceCard";
import Button from "../Button/Button";
import { apiGetSources, apiAddSource, apiDeleteSource } from "../../services/apiSources";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import AcceptModal from "../AcceptModal/AcceptModal";


export default function Sources() {
    const { userName, userId } = useAuthContext();
    const { notificationData, setNotificationData, toggleNotificationFunc, notificationToggle } = useNotificationContext();
    const [selectedType, setSelectedType] = useState('')
    const [sources, setSources] = useState([])
    const [loading, setLoading] = useState('start')

    const [pickedSource, setPickedSource] = useState({ id: '' })
    const [newSource, setNewSource] = useState({ value: '', description: '', source_type: '' })
    const [actionFunction, setActionFunction] = useState(null);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const openAcceptModalWithAction = (action) => {
        setActionFunction(() => action);
        setIsAcceptModalOpen(true);
    };

    function closeAcceptModal() {
        setIsAcceptModalOpen(false);
    };

    async function getSources(source_type) {
        try {
            setLoading('loading')
            const load_sources = await apiGetSources(source_type)
            setSources(load_sources)
            setLoading('loaded')
        } catch (err) {
            setLoading('error')
        }
    }

    async function addSource() {
        if (newSource.value.length === 0) {
            setNotificationData({ message: `Введите Page ID`, type: 'error' })
            toggleNotificationFunc()
            return 1
        }

        try {
            console.log(newSource)
            const response = await apiAddSource(newSource)
            if (response.status == 200) {
                getSources(newSource.source_type)
                setNotificationData({ message: 'Источник добавлен', type: 'success' })
                toggleNotificationFunc()
                setNewSource({ value: '', description: '', source_type: selectedType })
            } else {
                setNotificationData({ message: 'Не удалось добавить источник', type: 'error' })
                toggleNotificationFunc()
                setNewSource({ value: '', description: '', source_type: selectedType })
            }
        } catch (error) {

            setNotificationData({ message: `Проблема с бекендом: ${err}`, type: 'error' })
            toggleNotificationFunc()
            setNewSource({ value: '', description: '', source_type: selectedType })
        }
    }

    async function deleteSource() {

        const response = await apiDeleteSource(selectedType, pickedSource.id)
        if (response.status == 200) {
            setPickedSource({ id: '' })
            getSources(selectedType)
            setNotificationData({ message: 'Источник удален', type: 'success' })
            toggleNotificationFunc()
            setNewSource({ value: '', description: '', source_type: selectedType })
            closeAcceptModal()

        } else {
            closeAcceptModal()
            setNotificationData({ message: 'Не удалось удалить источник', type: 'error' })
            toggleNotificationFunc()

        }
    }

    // useEffect(() => {
    //     getSchedulerInfo()
    // }, [])
    return (<>
        <div className="sourcesSetType">
            <p>Источники информации о стендах
                <button
                    onClick={() => {
                        setShowHint((prev) => !prev);
                    }}
                    className={showHint ? "showHintActivated" : "showHint"}
                >
                    ?
                </button></p>
            <button
                onClick={() => { setSources([]); setSelectedType('manual'); setLoading('loaded'); setNewSource({ value: '', description: '', source_type: '' }) }}
                className={selectedType == 'manual' ? "sourcesSetTypeActive" : "sourcesSetType"}>
                Manual
            </button>
            <button onClick={() => { setSources([]); setSelectedType('confluence_page_id'); getSources('confluence_page_id'); setNewSource({ value: '', description: '', source_type: 'confluence_page_id' }) }}
                className={selectedType == 'confluence_page_id' ? "sourcesSetTypeActive" : "sourcesSetType"}>
                Confluence Page Id
            </button>
        </div>
        <div className="sourcesMenu">
            {loading === 'start' && <p> Выберите тип источника</p>}
            {showHint &&
                <div className="hintBox">
                    <p>
                        Источники информации (source_types) влияют на то, как стенды добавляются и обрабатываются в системе. На данный момент доступно 2 типа источников:
                    </p>
                    <p>
                        1. <strong>Manual</strong> - ручное создание стенда. Если стенд был создан напрямую через веб-интерфейс, он автоматически получит source_type manual.
                        К заполнению и изменению в данном режиме доступны только имя и описание стенда. Такие стенды могут участвовать в резервировании, но основном
                        этот тип используется при разработке и отладке приложения
                    </p>
                    <p>
                        2. <strong>Confluence Page Id</strong> - информация о стенде загружается из Confluence. Для создания стенда необходимо добавить источник:

                        <ul>
                            <li>Скопировать Id странцы Confluence со стендом в поле "Page ID". Id страницы отображается в конце адреса страницы в браузере,
                                например https://...viewpage.action?pageId=132941063. Вставлять в поле нужно только число</li>
                            <li>Заполнить описание (опционально)</li>
                            <li>Добавить источник и принудительнообновить данные, либо дождаться ближайшего штатного обновления</li>
                        </ul>
                    </p>
                    <p>
                        Как обрабатывается данный тип источников:
                        <ul>
                            <li>Сервис по pageId загружает верстку и метаданные нужной страницы из Confluence</li>
                            <li>Если загрузка прошла успешно и данные в порядке, сервис создает стенд и привязывает его к данному источнику </li>
                            <li>Сервис периодически обновляет конфигурации стендов, сравнивая имеющиеся данные (версия страницы, время последнего обновления)
                                со свежими данными из Confluence</li>
                        </ul>
                    </p>
                    <p>
                        Для корректной работы данного механизма <strong>важно</strong>, чтобы:
                        <ul>
                            <li>На целевой странице в Confluence хранились данные только одного стенда</li>
                            <li>Название страницы соответствовало ожидаемому названию стенда</li>
                        </ul>
                    </p>
                </div>
            }
            {loading === 'loading' && <p> Loading ...</p>}
            {loading === 'error' && <p> бекенд отвалился</p>}
            {loading === 'loaded' && selectedType === 'manual' && <>
                <div className="hintBox">
                    <p>Тип manual по умолчанию присваивается стенду при создании стенда вручную</p>
                    <p>Выберете другие источники, если хотите создать стенды автоматизированно</p>
                </div>
            </>}
            {loading === 'loaded' && selectedType === 'confluence_page_id' && <>
                <div className="sourcesNewSource">


                    <p className="sourcesNewSource">Добавить источник Confluence Page ID</p>
                    <div className="sourcesNewSourceTextareas">
                        <textarea name="newSource1"
                            id={'newSource1'}
                            placeholder='Page ID'
                            className="sourcesNewSourcePageId"
                            value={newSource.value}
                            onChange={e => setNewSource({ ...newSource, value: e.target.value })}
                        >
                        </textarea>
                        <textarea name="newSource2"
                            id={'newSource2'}
                            placeholder='Описание'
                            className="sourcesNewSourceDescription"
                            value={newSource.description}
                            onChange={e => setNewSource({ ...newSource, description: e.target.value })}
                        >
                        </textarea>
                    </div>

                    <Button style={"projectAccept"} onClick={() => { setNewSource({ ...newSource, source_type: 'confluence_page_id' }); addSource() }}> Добавить </Button>
                </div>
                {sources.length === 0 && <p> Источников с таким типом не найдено</p>}
                {sources.length > 0 && <>
                    {sources.map(source =>
                        <SourceCard id={source.id}
                            value={source.value}
                            description={source.description}
                            status={source.status}
                            picked={pickedSource.id === source.id && true || false}
                            onClick1={() => { setPickedSource(source); console.log(1) }}
                            onClick2={() => { setPickedSource({ id: '' }); }}
                            onClick3={() => openAcceptModalWithAction(deleteSource)}
                        ></SourceCard>
                    )}
                </>}
            </>}
        </div>
        <AcceptModal isOpen={isAcceptModalOpen} onClose={closeAcceptModal}>
            <div className="acceptModal">
                <div className="acceptModalText">
                    Вы уверены?
                </div>
                <div className="acceptModalButtons">
                    <Button style={"modalAccept"} onClick={() => { actionFunction(); closeAcceptModal(); }}> Да </Button>
                    <Button style={"modalReject"} onClick={closeAcceptModal}> Нет </Button>
                </div>
            </div>
        </AcceptModal>
    </>
    );
}