import React from "react";
import { useState, useEffect, useContext } from "react";
import "./Main.css";
import { apiGetStands, apiGetStand } from "../../services/apiStands";
import StandCard from "../Stands/StandCard/StandCard";
import Filter from "../Filter/Filter";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Main() {
    const [loading, setLoading] = useState('loading')
    const [stands, setStands] = useState([])
    const [pickedStand, setPickedStand] = useState({ id: 'default', name: 'Стенд', source_type: '' })
    const [standInfo, setStandInfo] = useState({ description: '', page_layout: '' })
    const [renderedElement, setRenderedElement] = useState(false)

    const [filterStands, setFilterStands] = useState({ status: '', source_type: '' });
    const [standStatuses, setStandStatuses] = useState([['free', "Свободен"], ['busy', "Занят"], ['maintenance', "Обслуживание"], ['unknown', "Неизвестен"]])
    const [sourceTypes, setSourceTypes] = useState([['manual', "Добавлены вручную"], ['confluence_page_id', 'Confluence PageId'], ['page_idsearch',]])

    async function getStands() {
        try {
            setLoading('loading')
            const stands = await apiGetStands()
            console.log(stands)
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


    function renderFromJson(node) {
        if (!node) return null;
        if (typeof node === 'string') return node;
        if (typeof node !== 'object') return null;

        if ('text' in node) return node.text;
        if (!('tag' in node)) return null;

        const { tag, children = [], attrs = {} } = node;
        return React.createElement(
            tag,
            attrs,
            ...(Array.isArray(children) ? children.map(renderFromJson) : [])
        );
    }

    const filteredStands = stands.filter(item => {
        return (
            (filterStands.status === '' || item.status.includes(filterStands.status)) &&
            (filterStands.source_type === '' || item.source_type.includes(filterStands.source_type))
        );
    }
    )


    useEffect(() => {
        getStands()
    }, [])

    return (
        <>
            <div className="mainLeftContainer">
                <div className="mainLeft1">
                    {/* <div>Стенды</div> */}
                    {loading === 'loading' && <p> Loading ...</p>}
                    {loading === 'error' && <p> бекенд отвалился</p>}
                    {loading === 'loaded' && stands.length == 0 && <> <p>Пока не добавлено ни одного стенда</p></>}
                    {loading === 'loaded' && <>

                        <Filter onClick={() => setFilterStands({ status: '', source_type: '' })} closeText="X">
                            <select className='filter adaptive' onChange={e => setFilterStands({ ...filterStands, status: e.target.value })}>
                                {loading === 'loaded' && <>{<option className='' value="" selected={filterStands.status === '' && true || false}>Все статусы </option>}
                                    {standStatuses.map((type, index) => <option id={index} value={type[0]}>{type[1]}</option>)}</>}
                                {loading === 'error' && <>{<option value="" selected={filterStands.status === '' && true || false}>Бекенд отвалился</option>}</>}
                            </select>
                            <select className='filter adaptive' adaptive onChange={e => setFilterStands({ ...filterStands, source_type: e.target.value })}>
                                {loading === 'loaded' && <>{<option className='' value="" selected={filterStands.status === '' && true || false}>Все источники</option>}
                                    {sourceTypes.map((type, index) => <option id={index} value={type[0]}>{type[1]}</option>)}</>}
                            </select>
                        </Filter>
                    </>}
                    {/* <Filter onClick={() => setFilterStands({ status: '', source_type: '' })}>
                        <select className='filter' onChange={e => setFilterStands({ ...filterStands, status: e.target.value })}>
                            {loading === 'loaded' && <>{<option className='' value="" selected={filterStands.status === '' && true || false}> Статус </option>}
                                {logLevels.map((level, index) => <option id={index} value={level}>{level}</option>)}</>}
                            {loadingLogs === 'error' && <>{<option value="" selected={filterLogs.status === '' && true || false}>Бекенд отвалился</option>}</>}
                        </select>
                        <input type="text" className="filter" placeholder="Текст записи" onChange={e => setFilterLogs({ ...filterLogs, note: e.target.value })} value={filterLogs.note} />
                    </Filter> */}
                </div>
                {console.log(filterStands)}
                {loading === 'loading' && <p> Loading ...</p>}
                {loading === 'error' && <p> бекенд отвалился</p>}
                {loading === 'loaded' && stands.length == 0 && <> <p>Пока не добавлено ни одного стенда</p></>}
                {loading === 'loaded' && <>
                    <div className="mainLeft2">
                        {filteredStands.map(stand =>
                            <StandCard
                                key={stand.id}
                                id={stand.id}
                                name={stand.name}
                                status={stand.status}
                                source_type={stand.source_type}
                                picked={pickedStand['id'] === stand.id && true || false}
                                onClick={() => {
                                    getStand(stand.id).then(() => setPickedStand(stand));
                                }}>
                            </StandCard>)}
                    </div>
                </>}
            </div>
            <div className="mainRightContainer">
                <div className="mainRight1">
                    <div className="mainStandLayout">
                        {standInfo.description && (standInfo.description) || <>
                            {renderFromJson(standInfo.page_layout[0])}
                            {renderFromJson(standInfo.page_layout[1])}
                            {renderFromJson(standInfo.page_layout[2])}
                        </>
                        }

                    </div>
                    <div className="mainRight2"></div>
                </div>
                <div className="mainStandDescription">
                    {standInfo.description && (standInfo.description) || <></>}

                </div>
            </div>

        </>
    );
}
