import React, { Component, useState, useEffect } from "react";
import "./Stands.css";
import StandCard from "./StandCard/StandCard";
import { useTimedMessagesContext } from "../../hooks/useTimedMessagesContext";
import { apiGetStands, apiGetStand } from "../../services/apiStands";
import Filter from "../Filter/Filter";
import ExternalLinkIcon from '../../svg_images/ExternalLink.svg'
import CopyIcon from '../../svg_images/Copy.svg'


export default function Stands() {
    const [loading, setLoading] = useState('loading')
    const [stands, setStands] = useState([])
    const [pickedStand, setPickedStand] = useState({ id: '', name: 'Стенд', source_type: '' })
    const [standInfo, setStandInfo] = useState({ description: '', page_layout: '' })
    const [renderedElement, setRenderedElement] = useState(false)
    const { messages, addMessage } = useTimedMessagesContext();

    const [filterStands, setFilterStands] = useState({ status: '', name: '' });
    const [standStatuses, setStandStatuses] = useState([['free', "Свободен"], ['busy', "Занят"], ['maintenance', "Обслуживание"], ['unknown', "Неизвестен"]])
    const [sourceTypes, setSourceTypes] = useState([['manual', "Добавлены вручную"], ['confluence_page_id', 'Confluence PageId'], ['page_idsearch',]])

    async function getStands() {
        try {
            setLoading('loading')
            const stands = await apiGetStands()
            setStands(stands)
            setLoading('loaded')
        } catch (err) {
            setLoading('error')
        }
    }

    async function getStand(id) {
        try {
            const info = await apiGetStand(id)
            setStandInfo(info)
            // setRenderedElement(renderFromJson(info.page_layout[2]))

        } catch (err) {
            setLoading('error')
        }
    }
    const VOID_ELEMENTS = new Set([
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
        'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]);

    function renderFromJson(node) {
        if (!node) return null;
        if (typeof node === 'string') return node;
        if (typeof node !== 'object') return null;
        if ('text' in node) return node.text;
        if (!('tag' in node)) return null;

        const { tag, children = [], attrs = {} } = node;

        if (VOID_ELEMENTS.has(tag)) {
            return React.createElement(tag, attrs);
        }

        return React.createElement(
            tag,
            attrs,
            ...(Array.isArray(children) ? children.map(renderFromJson) : [])
        );
    }

    const filteredStands = stands.filter(item => {
        return (
            (filterStands.status === '' || item.status.includes(filterStands.status)) &&
            (filterStands.name === '' || item.name.includes(filterStands.name))
        );
    }
    )
    const handleCopy = (link) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link)
                .then(() => addMessage("Ссылка скопирована!", 'success', 2400))
                .catch(() => addMessage("Ошибка при копировании ссылки", 'error', 2400));
        } else {
            addMessage("Копирование не выполнено, проверьте window.location.protocol и navigator.clipboard", 'warning', 5000);
        }
    };

    const handleOpen = () => {
        window.open(standInfo.source_link, "_blank", "noopener,noreferrer");
    };

    useEffect(() => {
        getStands()
    }, [])

    return (
        <>
            <div className="standsLeftContainer">
                <div className="standsLeft1">
                    {/* <div>Стенды</div> */}
                    {loading === 'loading' && <p> Loading ...</p>}
                    {loading === 'error' && <p> бекенд отвалился</p>}

                    {loading === 'loaded' && <>

                        <Filter onClick={() => setFilterStands({ status: '', name: '' })} closeText="X">
                            <select className='filter adaptive' onChange={e => setFilterStands({ ...filterStands, status: e.target.value })}>
                                {loading === 'loaded' && <>{<option className='' value="" selected={filterStands.status === '' && true || false}>Все статусы </option>}
                                    {standStatuses.map((type, index) => <option id={index} value={type[0]}>{type[1]}</option>)}</>}
                                {loading === 'error' && <>{<option value="" selected={filterStands.status === '' && true || false}>Бекенд отвалился</option>}</>}
                            </select>
                            <input type="text" className="filter standsStandsFilter" placeholder="Название"
                                onChange={e => setFilterStands({ ...filterStands, name: e.target.value })} value={filterStands.name} />
                        </Filter>
                    </>}
                </div>
                {loading === 'loading' && <p> Loading ...</p>}
                {loading === 'error' && <p> бекенд отвалился</p>}
                {loading === 'loaded' && stands.length == 0 && <> <p>Пока не добавлено ни одного стенда</p></>}
                {loading === 'loaded' && <>
                    <div className="standsLeft2">
                        {filteredStands.map(stand =>
                            <StandCard
                                key={stand.id}
                                id={stand.id}
                                name={stand.name}
                                status={stand.status}
                                source_type={stand.source_type}
                                errorWarning={stand.source_status == 'failed' && true || false}
                                picked={pickedStand['id'] === stand.id && true || false}
                                onClick={() => {
                                    setStandInfo({ description: '', page_layout: '' });
                                    getStand(stand.id).then(() => setPickedStand(stand));
                                }}>
                            </StandCard>)}
                    </div>
                </>}
            </div>
            <div className="standsRightContainer">
                <div className="standsRight1">
                    <div className="standsStandParams">
                        <div className="standsManageStand">
                            <div className="standsManageStandTopLabel">{pickedStand.name}</div>
                            <div className="standsManageStandAllParams">
                                <div className="standsStandsParamsLeft">
                                    <div className="param-row">
                                        <div className="param-key">Статус</div>
                                        <div>{pickedStand.status}</div>
                                    </div>
                                    <div className="param-row">
                                        <div className="param-key">Источник</div>
                                        <div>{pickedStand.source_type || pickedStand.id && "Отсутствует" || ""}</div>
                                    </div>
                                    <div className="param-row">
                                        <div className="param-key">Кем создан</div>
                                        <div>{pickedStand.created_by || pickedStand.id && "Неизвестно" || ""}</div>
                                    </div>
                                    <div className="param-row">
                                        <div className="param-key">Статус источника</div>
                                        <div>{pickedStand.source_status || pickedStand.id && !pickedStand.source_status && "Отсутствует"}</div>
                                    </div>
                                    <div className="param-row">
                                        <div className="param-key">Последнее обновление</div>
                                        <div>{pickedStand.updated_at === "never" && "Отсутствует" || pickedStand.updated_at}</div>
                                    </div>
                                    <div className="param-row">
                                        <div className="param-key">Ссылка на страницу стенда</div>
                                        <div>{standInfo.source_link && <div className="sourcesIconsContainer">
                                            Доступна
                                            <div className="iconWithTooltip" onClick={() => handleCopy(standInfo.source_link)}>
                                                <CopyIcon className="externalLinkIconStyle" />
                                                <span className="tooltip">Скопировать ссылку</span>
                                            </div>
                                            <div className="iconWithTooltip" onClick={handleOpen}>
                                                <ExternalLinkIcon className="externalLinkIconStyle" />
                                                <span className="tooltip">Открыть ссылку в новом окне</span>
                                            </div>
                                        </div> || pickedStand.id && "Отсутствует" || ""}</div>
                                    </div>
                                </div>
                                <div className="standsStandsParamsRight">
                                    <textarea name="newStand"
                                        maxLength={4000}
                                        placeholder='Описание'
                                        className="standsStandDescription"
                                        value={standInfo.description}
                                    >
                                    </textarea>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
                <div className="standsRight2">
                    <div className="standsStandLayout">
                        {standInfo.page_layout && <>
                            {standInfo.page_layout.map(element =>
                                renderFromJson(element)
                            )
                            }
                        </>
                        }
                    </div>
                </div>
            </div>

        </>
    );
}
