import React, { Component, useState, useEffect } from "react";
import "./Sources.css";
import SourceCard from "./SourceCard/SourceCard";
import StandCard from "../Stands/StandCard/StandCard";
import { apiGetSources, apiAddSource, apiDeleteSource, apiActualizeSource, apiActualizeAllSources, apiChangeSource } from "../../services/apiSources";
import { apiGetStands, apiGetStand, apiChangeStand, apiAddStand, apiDeleteStand } from "../../services/apiStands";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useTimedMessagesContext } from "../../hooks/useTimedMessagesContext";
import AcceptModal from "../AcceptModal/AcceptModal";
import Loader from "../Loader/Loader";
import ExternalLinkIcon from '../../svg_images/ExternalLink.svg'
import CopyIcon from '../../svg_images/Copy.svg'

export default function Sources() {
    const { userName, userId } = useAuthContext();
    const { messages, addMessage } = useTimedMessagesContext();

    const [selectedType, setSelectedType] = useState('')
    const [sources, setSources] = useState([])
    const [loading, setLoading] = useState('start')
    const [loaderActive, setLoaderActive] = useState(false)


    const [pickedSource, setPickedSource] = useState({ id: 0 })
    const [newSource, setNewSource] = useState({ value: '', description: '', source_type: '' })
    const [changedSource, setChangedSource] = useState({ id: 0, description: '' })
    const [actionFunction, setActionFunction] = useState(null);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [serverResponse, setServerResponse] = useState([]);
    const [isChanged, setIsChanged] = useState(false)

    // stands
    const [loadingStands, setLoadingStands] = useState('start')
    const [newStand, setNewStand] = useState({ name: '', description: '' })
    const [stands, setStands] = useState([])
    const [pickedStand, setPickedStand] = useState({ id: '', name: '', source_type: '' })
    const [loadedStand, setLoadedStand] = useState(false)
    const [isStandChanged, setIsStandChanged] = useState(false)
    // stands

    const openAcceptModalWithAction = (action) => {
        setActionFunction(() => action);
        setIsAcceptModalOpen(true);
    };

    function closeAcceptModal() {
        setIsAcceptModalOpen(false);
    };

    function resetLocalChanges() {
        setNewSource({ value: '', description: '', source_type: '' });
        setChangedSource({ id: 0, description: '' })
        setPickedSource({ id: 0 });
        setPickedStand({ id: '', name: '', source_type: '' })
        setNewStand({ name: '', description: '' })
    }

    async function getSources(source_type) {
        try {
            setLoading('loading')
            const load_sources = await apiGetSources(source_type)
            setSources(load_sources)
            setIsChanged(false)
            setLoading('loaded')
        } catch (err) {
            setLoading('error')
        }
    }

    function extractPageId(value) {
        // Только цифры, от 1 до 30 символов
        if (/^\d{1,30}$/.test(value)) {
            return value;
        }
        // pageId=число (1-30 цифр) в конце строки
        const match = value.match(/pageId=(\d{1,30})$/);
        if (match) {
            return match[1];
        }
        return null;
    }

    const handleCopy = (link) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link)
                .then(() => addMessage("Ссылка скопирована!", 'success', 2400))
                .catch(() => addMessage("Ошибка при копировании ссылки", 'error', 2400));
        } else {
            addMessage("Копирование не выполнено, проверьте window.location.protocol и navigator.clipboard", 'warning', 5000);
            // alert("Копирование не выполнено, проверьте window.location.protocol и navigator.clipboard");
        }
    };

    const handleOpen = () => {
        window.open(pickedSource.link, "_blank", "noopener,noreferrer");
    };

    async function addSourceConfluencePageId() {
        if (newSource.value.length === 0) {
            addMessage('Введите ссылку на страницу или её PageId ', 'warning', 3200)
            return 1
        }
        if (!newSource.source_type) {
            newSource.source_type = selectedType
        }
        let noteToAdd = {}
        noteToAdd.source_type = selectedType
        if (!extractPageId(newSource.value)) {
            addMessage(`Введите либо ссылку, содержащую pageId=12345, либо число, соответствующее желаемому pageId`, 'warning', 5000)
            return false;
        }
        noteToAdd.value = extractPageId(newSource.value)
        noteToAdd.description = newSource.description

        try {
            console.log(noteToAdd)
            const response = await apiAddSource(noteToAdd);
            const body = await response.json();

            console.log("response on addSource:", response.status);

            if (response.status === 200) {
                console.log(body.message);
                resetLocalChanges();
                getSources(selectedType);
                addMessage('Источник добавлен', 'success', 3000)
                closeAcceptModal();
            } else {
                console.log(body.success);
                console.log(body.message);
                addMessage(`Не удалось добавить источник: ${body.message}`, 'info', 10000)
            }
        } catch (error) {
            console.log('Error:', error);
            resetLocalChanges();
            setNewSource({ value: '', description: '', source_type: selectedType });
            closeAcceptModal();
            addMessage(`Не удалось добавить источник: ${body.message}`, 'info', 10000)
            getSources(selectedType);
        }
    }

    async function addSourceConfluenceTag() {
        if (newSource.value.length === 0) {
            addMessage('Введите тег ', 'warning', 3200)
            return 1
        }
        if (!newSource.source_type) {
            newSource.source_type = selectedType
        }
        let noteToAdd = {}
        noteToAdd.source_type = selectedType
        noteToAdd.value = newSource.value
        noteToAdd.description = newSource.description

        try {
            console.log(noteToAdd)
            const response = await apiAddSource(noteToAdd);
            const body = await response.json();

            console.log("response on addSource:", response.status);

            if (response.status === 200) {
                console.log(body.message);
                resetLocalChanges();
                getSources(selectedType);
                addMessage('Источник добавлен', 'success', 3000)
                closeAcceptModal();
            } else {
                console.log(body.success);
                console.log(body.message);
                addMessage(`Не удалось добавить источник: ${body.message}`, 'info', 10000)
            }
        } catch (error) {
            console.log('Error:', error);
            resetLocalChanges();
            setNewSource({ value: '', description: '', source_type: selectedType });
            closeAcceptModal();
            addMessage(`Не удалось добавить источник: ${body.message}`, 'info', 10000)
            getSources(selectedType);
        }
    }

    async function actualizeSource() {
        console.log(`actualize for source with type: ${selectedType}, id: ${pickedSource.id}, pageId: ${pickedSource.value}`)
        setLoaderActive(true)
        const response = await apiActualizeSource(selectedType, pickedSource.id)
            .then(response => response.json())
            .then(data => {
                console.log(data.success);
                setLoaderActive(false)
                if (data.success) {
                    addMessage('Данные источника успешно обновлены', 'success', 3000)
                } else {
                    addMessage('Не удалось обновить данные источника, подробнее в описании источника', 'error', 3000)
                }
                setPickedSource({ id: 0 })
                setNewSource({ value: '', description: '', source_type: selectedType })
                getSources(selectedType)
            })
            .catch(error => {
                console.log('Error:', error)
                setPickedSource({ id: 0 })
                setNewSource({ value: '', description: '', source_type: selectedType })
                setLoaderActive(false)
                addMessage(`Проблема с бекендом: ${error}`, 'info', 10000)
            });
    }

    async function actualizeAllSources() {
        console.log(`bulk update sources: ${selectedType}`)
        addMessage(`Ожидайте`, 'info', 3200)
        setLoaderActive(true)
        const response = await apiActualizeAllSources(selectedType)
            .then(response => response.json())
            .then(data => {
                console.log(data.success);
                setLoaderActive(false)
                if (data.success) {
                    addMessage('Массовое обновление прошло успешно', 'success', 3000)
                } else {
                    addMessage(`Не удалось обновить часть источников`, 'error', 3000)
                }
                setPickedSource({ id: 0 })
                setNewSource({ value: '', description: '', source_type: selectedType })
                getSources(selectedType)
            })
            .catch(error => {
                console.log('Error:', error)
                setPickedSource({ id: 0 })
                setNewSource({ value: '', description: '', source_type: selectedType })
                setLoaderActive(false)
                addMessage(`Проблема с бекендом: ${error}`, 'error', 3000)
            });
    }

    async function changeSource() {
        if (pickedSource.id !== changedSource.id) {
            addMessage("Внутренняя ошибка: pickedSource.id !== changedSource.id", 'error', 10000)
            return 1
        }
        if (!isChanged.name && !isChanged.description) {
            addMessage("Внесите изменения, чтобы их применить", 'warning', 3000)
            return 1
        }
        let fields_to_update = {}
        if (isChanged.description) { fields_to_update.description = pickedSource.description }
        const response = await apiChangeSource(selectedType, pickedSource['id'], fields_to_update)
        if (response.status == 200) {
            getSources(selectedType)
            addMessage('Источник изменён', 'success', 3000)

        } else {
            addMessage('Не удалось изменить источник', 'error', 3000)
        }
    }

    async function deleteSource() {
        const response = await apiDeleteSource(selectedType, pickedSource.id)
            .then(response => {
                console.log("response on deleteSource:", response.status);
                return { status: response.status, body: response.json() }
            })
            .then(data => {
                if (data.status == 200) {
                    resetLocalChanges()
                    getSources(selectedType)
                    addMessage('Источник удален', 'info', 3000)
                    setNewSource({ value: '', description: '', source_type: selectedType })
                    closeAcceptModal()
                } else {
                    console.log(data.body.success);
                    console.log(data.body.message);
                    addMessage(`Не удалось удалить источник: ${data.message}`, 'warning', 10000)
                }
            })
            .catch(error => {
                console.log('Error:', error)
                setPickedSource({ id: 0 })
                setNewSource({ value: '', description: '', source_type: selectedType })
                addMessage(`Проблема с бекендом: ${error}`, 'error', 10000)
                return 1
            });
    }

    // stands functions

    async function getStands() {
        try {
            setLoadingStands('loading')
            const result = await apiGetStands()
            const loadedStands = Array.isArray(result) ? result : [];
            setStands(loadedStands)
            setLoadingStands('loaded')
        } catch (err) {
            setLoadingStands('error')
        }
    }

    async function getStand(id) {
        try {
            const lStand = await apiGetStand(id)

            setLoadedStand(lStand)
            setIsChanged({ name: false, description: false })
        } catch (err) {
            setLoadingStands('error')
        }
    }

    async function addStand() {
        if (!newStand['name'] || !newStand['description']) {
            addMessage('Заполните доступные поля', 'warning', 3000)
            return false
        }
        const response = await apiAddStand(newStand['name'], newStand['description'])
        if (response.status == 200) {
            setNewStand({ name: '', description: '' })
            setPickedStand({ id: '', name: '', description: '' })
            getStands()
            addMessage('Стенд добавлен', 'success', 3000)

        } else {
            addMessage('Не удалось добавить стенд', 'error', 3000)
        }
    }

    async function changeStand() {
        if (pickedStand.id !== loadedStand.id) {
            addMessage("Внутренняя ошибка: pickedStand.id !== loadedStand.id", 'error', 10000)
            return 1
        }
        if (!isStandChanged.name && !isStandChanged.description) {
            addMessage("Внесите изменения, чтобы их применить", 'warning', 3000)
            return 1
        }
        let fields_to_update = {}
        if (isStandChanged.name) { fields_to_update.name = loadedStand.name }
        if (isStandChanged.description) { fields_to_update.description = loadedStand.description }
        const response = await apiChangeStand(pickedStand['id'], fields_to_update)
        if (response.status == 200) {
            getStands()
            addMessage('Стенд изменён', 'success', 3000)

        } else {
            addMessage('Не удалось изменить стенд', 'error', 3000)
        }
    }

    async function deleteStand() {
        const response = await apiDeleteStand(pickedStand['id'])
        if (response.status == 200) {
            getStands()
            setPickedStand({ id: '', name: '', description: '' })
            addMessage('Стенд удалён', 'info', 3000)

        } else {
            addMessage('Не удалось удалить стенд', 'error', 3000)
        }
    }
    // stands functions

    return (

        <div className="sources">
            {loaderActive && <Loader />}
            <div className="sourcesLeft">
                <div className="sourcesSetType">
                    <div className="sourcesSetTypeHeader">
                        <p >Управление источниками данных о стендах</p>
                        <button
                            onClick={() => {
                                setShowHint((prev) => !prev);
                            }}

                            className={showHint ? "showHint picked" : "showHint"}
                        >
                            ?
                        </button>
                    </div>
                    {showHint &&
                        <div className="sourcesHint">
                            <div className="hintBox">
                                Описание источников информации и их работы доступно во вкладке <strong>О приложении</strong>
                            </div>
                        </div>
                        || <>
                            <button
                                onClick={() => { resetLocalChanges(); setSources([]); setSelectedType('manual'); getStands() }}
                                className={selectedType == 'manual' ? "sourcesSetType picked" : "sourcesSetType"}>
                                Ручное управление стендами
                            </button>
                            <button onClick={() => { resetLocalChanges(); setSelectedType('confluence_page_id'); getSources('confluence_page_id'); setNewSource({ value: '', description: '', source_type: 'confluence_page_id' }) }}
                                className={selectedType == 'confluence_page_id' ? "sourcesSetType picked" : "sourcesSetType"}>
                                Управление Confluence PageId
                            </button>
                            <button onClick={() => { resetLocalChanges(); setSelectedType('confluence_tag'); getSources('confluence_tag'); setSources([]); setNewSource({ value: '', description: '', source_type: 'confluence_tag' }) }}
                                className={selectedType == 'confluence_tag' ? "sourcesSetType picked" : "sourcesSetType"}>
                                Управление Confluence Tag
                            </button>
                        </>
                    }
                </div>

                <div className="sourcesNotes">
                    {selectedType === 'manual' && <>
                        <div className="admin-sources-standsLeft">
                            {loadingStands === 'loading' && <p> Loading ...</p>}
                            {loadingStands === 'error' && <p> бекенд отвалился</p>}
                            {loadingStands === 'loaded' && stands.length == 0 && <p>Пока не добавлено ни одного стенда</p>}
                            {loadingStands === 'loaded' && <>
                                {stands.map(stand =>
                                    <StandCard
                                        key={stand.id}
                                        id={stand.id}
                                        name={stand.name}
                                        picked={pickedStand['id'] === stand.id && true || false}
                                        source_type={stand.source_type}
                                        status={stand.status}
                                        updated_at={stand.stand_last}
                                        errorWarning={stand.source_status === 'failed' && true || false}
                                        onClick={() => { setNewStand({ name: '', description: '' }); setPickedStand(stand); getStand(stand.id) }}>
                                    </StandCard>)}</>}
                        </div>
                    </>}
                    {selectedType === 'confluence_tag' && <>

                    </>}
                    {loading === 'start' && selectedType !== 'manual' && selectedType !== 'confluence_tag' &&
                        <div className="sourcesHint">
                            <p> Выберите тип источника</p>
                        </div>
                    }
                    {loading === 'loading' && <p> Loading ...</p>}
                    {loading === 'error' && <p> бекенд отвалился</p>}

                    {loading === 'loaded' && selectedType === 'confluence_page_id' && <>
                        {sources.map(source =>
                            <SourceCard id={source.id}
                                value={source.value}
                                valueName={'PageId'}
                                version={source.version === '' && "Отсутствует" || source.version}
                                status={source.status}
                                picked={pickedSource.id === source.id && true || false}
                                updated_at={source.updated_at === 'never' && "Отсутствует" || source.updated_at}
                                onClick={() => { setNewSource({ value: '', description: '', source_type: 'confluence_page_id' }); setPickedSource(source); setChangedSource({ id: source.id, description: source.description }) }}
                            ></SourceCard>
                        )}
                    </>}
                    {loading === 'loaded' && selectedType === 'confluence_tag' && <>
                        {sources.map(source =>
                            <SourceCard id={source.id}
                                value={source.value}
                                valueName={'Tag'}
                                version={source.version === '' && "Отсутствует" || source.version}
                                status={source.status}
                                picked={pickedSource.id === source.id && true || false}
                                updated_at={source.updated_at === 'never' && "Отсутствует" || source.updated_at}
                                onClick={() => { setNewSource({ value: '', description: '', source_type: 'confluence_page_id' }); setPickedSource(source); setChangedSource({ id: source.id, description: source.description }) }}
                            ></SourceCard>
                        )}
                    </>}
                    {loading === 'loaded' && selectedType === 'confluence_page_id' && <>
                        {serverResponse.length > 0 && <>{serverResponse.map(note =>
                            <p> {console.log(none)}</p>

                        )

                        } </>}
                        {sources.length === 0 && <p> Источников с таким типом не найдено</p>}

                    </>}
                </div>

            </div>
            <div className="sourcesRight">
                {selectedType === 'manual' && <>
                    {loadingStands === 'loading' && <p> Loading ...</p>}
                    {loadingStands === 'error' && <p> бекенд отвалился</p>}
                    {loadingStands === 'loaded' && <>
                        {stands && !pickedStand.id &&
                            <div className="admin-sources-standsManageStandWrapper">
                                <div className="admin-sources-standsManageStand">
                                    <div className="admin-sources-standsManageStandTopLabel">Добавить новый стенд</div>
                                    <input type="text"
                                        maxLength={100}
                                        placeholder='Название'
                                        className="admin-sources-manageStand newName"
                                        value={newStand.name}
                                        onChange={e => setNewStand({ ...newStand, name: e.target.value })}
                                    />

                                    <textarea name="newStand"
                                        maxLength={4000}
                                        placeholder='Описание'
                                        className="admin-sources-manageStand description"
                                        value={newStand.description}
                                        onChange={e => setNewStand({ ...newStand, description: e.target.value })}
                                    >
                                    </textarea>
                                    <div className="admin-sources-standsManageStandButtons">
                                        <button onClick={() => { addStand() }}> Добавить </button>
                                        <button onClick={() => setNewStand({ name: '', description: '' })}> Очистить </button>
                                    </div>
                                </div>
                            </div>

                        }

                        {stands && pickedStand.id && loadedStand &&
                            <div className="admin-sources-standsManageStandWrapper changeStand">
                                <div className="admin-sources-standsManageStand">
                                    <div className="admin-sources-standsManageStandTopLabel">Редактировать стенд</div>
                                    <div className="admin-sources-changeStandParams">
                                        <input type="text"
                                            maxLength={100}
                                            placeholder='Название'
                                            className="admin-sources-manageStand name"
                                            value={loadedStand.name}
                                            onChange={e => {
                                                setLoadedStand({ ...loadedStand, name: e.target.value });
                                                setIsStandChanged({ ...isStandChanged, name: true })
                                            }}
                                        />
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
                                            <div>{pickedStand.updated_at === "never" && "Отсутствует" || pickedStand.updated_at}</div>
                                        </div>
                                    </div>
                                    <textarea name="newStand"
                                        maxLength={4000}
                                        placeholder='Описание'
                                        className="admin-sources-manageStand description"
                                        value={loadedStand.description}
                                        onChange={e => {
                                            setLoadedStand({ ...loadedStand, description: e.target.value });
                                            setIsStandChanged({ ...isStandChanged, description: true });
                                        }}
                                    >
                                    </textarea>
                                    <div className="admin-sources-standsManageStandButtons">
                                        <button onClick={() => { openAcceptModalWithAction(changeStand) }}> Применить изменения </button>
                                        <button onClick={() => { setPickedStand({ id: 0 }); setLoadedStand(false) }}> Отменить </button>
                                        <button className={pickedStand.source_type !== 'manual' && "admin-sources-standsDeleteButton disabled" || "admin-sources-standsDeleteButton"} disabled={pickedStand.source_type !== 'manual' && true || false} onClick={() => { openAcceptModalWithAction(deleteStand) }}> Удалить </button>
                                    </div>
                                </div>
                            </div> || <></>
                        }
                    </>}

                </>}
                {loading === 'start' && selectedType !== 'manual' &&
                    <div className="sourcesHint">
                        <p> Выберите тип источника</p>
                    </div>
                }
                {loading === 'loading' && <p> Loading ...</p>}
                {loading === 'error' && <p> бекенд отвалился</p>}


                {loading === 'loaded' && selectedType === 'confluence_page_id' && !pickedSource.id &&
                    <div className="sourcesManageSourceWrapper">
                        <div className="sourcesManageSource">
                            <div className="sourcesManageSourceTopLabel">Добавить новый источник Confluence Page ID</div>
                            <input type="text"
                                maxLength={150}
                                placeholder='Ссылка на страницу Confluence либо PageId'
                                className="manageSource name"
                                value={newSource.value}
                                onChange={e => setNewSource({ ...newSource, value: e.target.value })}
                            />
                            <div className="textareaContainer">
                                <textarea name="newSource"
                                    maxLength={4000}
                                    placeholder='Описание'
                                    className="manageSource description"
                                    value={newSource.description}
                                    onChange={e => setNewSource({ ...newSource, description: e.target.value })}
                                >
                                </textarea>
                            </div>
                            <div className="sourcesManageSourceButtons">
                                <button onClick={() => addSourceConfluencePageId()}> Добавить </button>
                                <button onClick={() => setNewSource({ value: '', description: '', source_type: 'confluence_page_id' })}> Очистить </button>
                                <button className="sourcesRightButton" onClick={() => { actualizeAllSources() }}> Массовое обновление</button>
                            </div>
                        </div>
                    </div>
                }
                {loading === 'loaded' && selectedType === 'confluence_page_id' && pickedSource.id &&
                    <div className="sourcesManageSourceWrapper changeSource">
                        <div className="sourcesManageSource">
                            <div className="sourcesManageSourceTopLabel">Редактировать выбранный источник</div>
                            <div className="changeSourceParams">
                                <div className="param-row">
                                    <div className="param-key">PageId</div>
                                    <div>{pickedSource.value}</div>
                                </div>
                                <div className="param-row">
                                    <div className="param-key">Статус</div>
                                    <div>{pickedSource.status}</div>
                                </div>
                                <div className="param-row">
                                    <div className="param-key">Версия</div>
                                    <div>{pickedSource.version || "Отсутствует"}</div>
                                </div>
                                <div className="param-row">
                                    <div className="param-key">Последнее обновление</div>
                                    <div>{pickedSource.updated_at === "never" && "Отсутствует" || pickedSource.updated_at}</div>
                                </div>
                                <div className="param-row">
                                    <div className="param-key">Кем создан</div>
                                    {console.log(pickedSource.created_by)}
                                    <div>{pickedSource.created_by && pickedSource.created_by || "Неизвестно"}</div>
                                </div>
                                <div className="param-row">
                                    <div className="param-key">Созданный стенд</div>
                                    <div>{pickedSource.stand_id && pickedSource.stand_name || "Отсутствует"}</div>
                                </div>
                                <div className="param-row">
                                    <div className="param-key">Страница стенда</div>

                                    <div>{pickedSource.link && <div className="sourcesIconsContainer">
                                        Ссылка доступна
                                        <div className="iconWithTooltip" onClick={() => handleCopy(pickedSource.link)}>
                                            <CopyIcon className="externalLinkIconStyle" />
                                            <span className="tooltip">Скопировать ссылку</span>
                                        </div>
                                        <div className="iconWithTooltip" onClick={handleOpen}>
                                            <ExternalLinkIcon className="externalLinkIconStyle" />
                                            <span className="tooltip">Открыть ссылку в новом окне</span>
                                        </div>
                                    </div> || "Ссылка отсутствует"}</div>
                                </div>
                            </div>
                            <div className="textareaContainer">
                                <textarea name="newSource"
                                    maxLength={4000}
                                    placeholder='Описание'
                                    className="manageSource description"
                                    value={pickedSource.description}
                                    // onChange={e => setPickedSource({ ...pickedSource, description: e.target.value })}
                                    onChange={e => {
                                        setPickedSource({ ...pickedSource, description: e.target.value });
                                        setIsChanged({ ...isChanged, description: true });
                                    }}
                                >
                                </textarea>
                            </div>
                            <div className="sourcesManageSourceButtons">
                                <button onClick={() => { openAcceptModalWithAction(changeSource) }}> Применить изменения </button>
                                <button onClick={() => { actualizeSource() }}>Обновить данные</button>
                                <button onClick={() => { setPickedSource({ id: 0 }), setChangedSource({ id: 0, description: '' }) }}> Отменить </button>
                                <button className="sourcesRightButton" onClick={() => { openAcceptModalWithAction(deleteSource) }}> Удалить </button>
                            </div>
                        </div>
                    </div> || <></>
                }

                {loading === 'loaded' && selectedType === 'confluence_tag' && !pickedSource.id &&
                    <div className="sourcesManageSourceWrapper">
                        <div className="sourcesManageSource">
                            <div className="sourcesManageSourceTopLabel">Добавить новый источник Confluence Tag</div>
                            <input type="text"
                                maxLength={150}
                                placeholder='Тег страниц Confluence для поиска'
                                className="manageSource name"
                                value={newSource.value}
                                onChange={e => setNewSource({ ...newSource, value: e.target.value })}
                            />
                            <div className="textareaContainer">
                                <textarea name="newSource"
                                    maxLength={4000}
                                    placeholder='Описание'
                                    className="manageSource description"
                                    value={newSource.description}
                                    onChange={e => setNewSource({ ...newSource, description: e.target.value })}
                                >
                                </textarea>
                            </div>
                            <div className="sourcesManageSourceButtons">
                                <button onClick={() => addSourceConfluenceTag()}> Добавить </button>
                                <button onClick={() => setNewSource({ value: '', description: '', source_type: 'confluence_page_id' })}> Очистить </button>
                            </div>
                        </div>
                    </div>
                }
                {loading === 'loaded' && selectedType === 'confluence_tag' && pickedSource.id &&
                    <div className="sourcesManageSourceWrapper changeSource">
                        <div className="sourcesManageSource">
                            <div className="sourcesManageSourceTopLabel">Редактировать выбранный источник (Confluence Tag)</div>
                            <div className="changeSourceParams">
                                <div className="param-row">
                                    <div className="param-key">Тег</div>
                                    <div>{pickedSource.value}</div>
                                </div>
                                <div className="param-row">
                                    <div className="param-key">Статус</div>
                                    <div>{pickedSource.status}</div>
                                </div>
                                <div className="param-row">
                                    <div className="param-key">Последнее обновление</div>
                                    <div>{pickedSource.updated_at === "never" && "Отсутствует" || pickedSource.updated_at}</div>
                                </div>
                                <div className="param-row">
                                    <div className="param-key">Кол-во дочерних PageId</div>
                                    <div>{pickedSource.child_sources &&
                                        <>{pickedSource.child_sources.length}</>
                                        // <>{pickedSource.child_sources.map(biba => <div>{biba.id}</div>)}
                                        // </>
                                        || "Отсутствуют"}</div>
                                </div>
                            </div>
                            <div className="textareaContainer">
                                <textarea name="newSource"
                                    maxLength={4000}
                                    placeholder='Описание'
                                    className="manageSource description"
                                    value={pickedSource.description}
                                    // onChange={e => setPickedSource({ ...pickedSource, description: e.target.value })}
                                    onChange={e => {
                                        setPickedSource({ ...pickedSource, description: e.target.value });
                                        setIsChanged({ ...isChanged, description: true });
                                    }}
                                >
                                </textarea>
                            </div>
                            <div className="sourcesManageSourceButtons">
                                <button onClick={() => { openAcceptModalWithAction(changeSource) }}> Применить изменения </button>
                                <button onClick={() => { actualizeSource() }}>Обновить данные</button>
                                <button onClick={() => { setPickedSource({ id: 0 }), setChangedSource({ id: 0, description: '' }) }}> Отменить </button>
                                <button className="sourcesRightButton" onClick={() => { openAcceptModalWithAction(deleteSource) }}> Удалить </button>
                            </div>
                        </div>
                    </div> || <></>
                }
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