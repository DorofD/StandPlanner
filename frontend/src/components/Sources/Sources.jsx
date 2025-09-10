import React, { Component, useState, useEffect } from "react";
import "./Sources.css";
import SourceCard from "./SourceCard/SourceCard";
import { apiGetSources, apiAddSource, apiDeleteSource, apiActualizeSource, apiActualizeAllSources, apiChangeSource } from "../../services/apiSources";
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

    const handleCopy = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(LINK)
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
        // if (isChanged.name) { fields_to_update.name = loadedStand.name }
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


    return (

        <div className="sources">
            {loaderActive && <Loader />}
            <div className="sourcesLeft">
                <div className="sourcesSetType">
                    <div className="sourcesSetTypeHeader">
                        <p >Управление источниками информации о стендах</p>
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
                                onClick={() => { resetLocalChanges(); setSources([]); setSelectedType('manual') }}
                                className={selectedType == 'manual' ? "sourcesSetType picked" : "sourcesSetType"}>
                                Manual
                            </button>
                            <button onClick={() => { resetLocalChanges(); setSelectedType('confluence_page_id'); getSources('confluence_page_id'); setNewSource({ value: '', description: '', source_type: 'confluence_page_id' }) }}
                                className={selectedType == 'confluence_page_id' ? "sourcesSetType picked" : "sourcesSetType"}>
                                Confluence PageId
                            </button>
                            <button onClick={() => { resetLocalChanges(); setSelectedType('confluence_tag'); getSources('confluence_tag'); setSources([]); setNewSource({ value: '', description: '', source_type: 'confluence_tag' }) }}
                                className={selectedType == 'confluence_tag' ? "sourcesSetType picked" : "sourcesSetType"}>
                                Confluence Tag
                            </button>
                        </>
                    }
                </div>

                <div className="sourcesNotes">
                    {selectedType === 'manual' && <>
                        <div className="sourcesHint">
                            <div className="hintBox">
                                <p>
                                    Тип источников <strong>manual</strong> подразумевает создание стендов вручную и не имеет собственных объектов
                                </p>
                                <p>
                                    Перейдите во вкладку <strong>Администрирование / Стенды</strong>, если хотите создать стенд
                                </p>
                            </div>
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
                    <div className="sourcesHint">
                        <div className="hintBox">
                            Выбран тип источников <strong>manual</strong>
                        </div>
                    </div>
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
                                    <div className="param-key">Созданный стенд</div>
                                    <div>{pickedSource.stand_id && pickedSource.stand_name || "Отсутствует"}</div>
                                </div>
                                <div className="param-row">
                                    <div className="param-key">Страница стенда</div>

                                    <div>{pickedSource.link && <div className="sourcesIconsContainer">
                                        Ссылка доступна
                                        <div className="iconWithTooltip" onClick={handleCopy}>
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
                                    <div className="param-key">Созданныe источники PageId</div>
                                    <div>{pickedSource.child_sources && pickedSource.child_sources || "Отсутствуют"}</div>
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