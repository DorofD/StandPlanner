import React from "react";
import { useState, useEffect, useContext } from "react";
import "./Main.css";
import { apiGetStands, apiGetStand } from "../../services/apiStands";
import StandCard from "../Stands/StandCard/StandCard";
import Filter from "../Filter/Filter";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Main() {
    const [loadingStands, setLoadingStands] = useState('loading')
    const [stands, setStands] = useState([])
    const [pickedStand, setPickedStand] = useState({ id: 'default', name: 'Стенд', source_type: '' })
    const [standInfo, setStandInfo] = useState({ description: '', page_layout: '' })
    const [renderedElement, setRenderedElement] = useState(false)

    const [filterStands, setFilterStands] = useState({ name: '', status: '', source_type: '' });
    const [standStatuses, setStandStatuses] = useState([['free', "Свободен"], ['busy', "Занят"], ['maintenance', "Обслуживание"], ['unknown', "Неизвестен"]])
    const [sourceTypes, setSourceTypes] = useState(['manual', 'confluence_page_id', 'massive_search'])

    async function getStands() {
        try {
            setLoadingStands('loading')
            const stands = await apiGetStands()
            setStands(stands)
            setLoadingStands('loaded')
        } catch (err) {
            setLoadingStands('error')
        }
    }

    async function getStand(id) {
        try {
            const info = await apiGetStand(id)
            setStandInfo(info)
            // setRenderedElement(renderFromJson(info.page_layout[2]))

        } catch (err) {
            setLoadingStands('error')
        }
    }

    async function pickStand(id) {
        try {
            const info = await apiGetStand(id)
            setStandInfo(info)
            // setRenderedElement(renderFromJson(info.page_layout[2]))

        } catch (err) {
            setLoadingStands('error')
        }
    }
    // const json_layout = { "tag": "div", "children": [{ "tag": "div", "children": [{ "tag": "table", "children": [{ "tag": "colgroup", "children": [{ "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }] }, { "tag": "tbody", "children": [{ "tag": "tr", "children": [{ "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }] }, { "tag": "tr", "children": [{ "tag": "td", "children": [{ "tag": "span" }] }, { "tag": "td", "children": [{ "tag": "span" }] }, { "tag": "td", "children": [{ "tag": "div", "children": [{ "tag": "p", "children": [{ "tag": "span" }] }] }] }, { "tag": "td" }, { "tag": "td", "children": [{ "tag": "span" }] }, { "tag": "td" }, { "tag": "td", "children": [{ "tag": "span" }] }, { "tag": "td", "children": [{ "tag": "span" }] }, { "tag": "td" }, { "tag": "td" }, { "tag": "td", "children": [{ "tag": "div", "children": [{ "tag": "p", "children": [{ "tag": "div", "children": [{ "tag": "p", "children": [{ "tag": "div", "children": [{ "tag": "table", "children": [{ "tag": "tbody", "children": [{ "tag": "tr" }, { "tag": "tr", "children": [{ "tag": "th" }, { "tag": "th" }, { "tag": "th" }] }] }] }] }, { "tag": "div", "children": [{ "tag": "span", "children": [{ "tag": "span" }] }] }] }] }] }] }] }] }] }] }] }] }
    const json_layout = { "tag": "div", "children": [{ "tag": "div", "children": [{ "tag": "table", "children": [{ "tag": "colgroup", "children": [{ "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }] }, { "tag": "tbody", "children": [{ "tag": "tr", "children": [{ "tag": "th", "children": [{ "text": "Testbench P/N" }] }, { "tag": "th", "children": [{ "text": "Testbench S/N" }] }, { "tag": "th", "children": [{ "text": "Status" }] }, { "tag": "th", "children": [{ "text": "Dev MB" }] }, { "tag": "th", "children": [{ "text": "Dev IP" }] }, { "tag": "th", "children": [{ "text": "Host MB" }] }, { "tag": "th", "children": [{ "text": "Host IP" }] }, { "tag": "th", "children": [{ "text": "Target Type" }] }, { "tag": "th", "children": [{ "text": "Location" }] }, { "tag": "th", "children": [{ "text": "Rocket Chatroom" }] }, { "tag": "th", "children": [{ "text": "Open Issues" }] }] }, { "tag": "tr", "children": [{ "tag": "td", "children": [{ "tag": "span", "children": ["0101902001622"] }] }, { "tag": "td", "children": [{ "tag": "span", "children": ["0013824103"] }] }, { "tag": "td", "children": [{ "tag": "div", "children": [{ "tag": "p", "children": [{ "tag": "span", "children": [{ "text": "FREE" }] }] }] }] }, { "tag": "td", "children": [{ "text": "KWQ670" }] }, { "tag": "td", "children": [{ "tag": "span", "children": [{ "text": "172.19.115.158" }] }] }, { "tag": "td", "children": [{ "text": "KWQ670" }] }, { "tag": "td", "children": [{ "tag": "span", "children": [{ "text": "172.19.115.97" }] }] }, { "tag": "td", "children": [{ "tag": "span", "children": [{ "text": "SSD2-U2-v1" }] }] }, { "tag": "td", "children": [{ "text": "K405-3" }] }, { "tag": "td", "children": ["\u0421\u0442\u0435\u043d\u0434 \u0422\u041d\u04182 SSD2 #4"] }, { "tag": "td", "children": [{ "tag": "div", "children": [{ "tag": "p", "children": ["#refresh-module-1205053740 .icon {\n        background-position: left center;\n        background-repeat: no-repeat;\n        display: inline-block;\n        font-size: 0;\n        max-height: 16px;\n        text-align: left;\n        text-indent: -9999em;\n        vertical-align: text-bottom;\n    }", { "tag": "div", "children": [{ "tag": "p", "children": [{ "tag": "div", "children": [{ "tag": "table", "children": [{ "tag": "tbody", "children": [{ "tag": "tr" }, { "tag": "tr", "children": [{ "tag": "th", "children": [{ "text": "Key" }] }, { "tag": "th", "children": [{ "text": "Summary" }] }, { "tag": "th", "children": [{ "text": "Status" }] }] }] }] }] }, { "tag": "div", "children": [{ "tag": "span", "children": [{ "tag": "span", "children": [{ "text": "No issues found" }] }] }] }] }] }] }] }] }] }] }] }] }] }

    // function renderFromJson(node) {
    //     if (typeof node === 'string') return node;

    //     if (node && typeof node === 'object' && 'text' in node) {
    //         return node.text;
    //     }

    //     const { tag, children = [], attrs = {} } = node;

    //     return React.createElement(
    //         tag,
    //         attrs,
    //         ...(children.map(renderFromJson))
    //     );
    // }
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
                    <Filter onClick={() => setFilterStands({ status: '', source_type: '' })} closeText="X">
                        {/* <input type="text" className="filter" placeholder="Название" onChange={e => setFilterStands({ ...filterStands, name: e.target.value })} value={filterStands.name} /> */}
                        <select className='filter adaptive' onChange={e => setFilterStands({ ...filterStands, status: e.target.value })}>
                            {loadingStands === 'loaded' && <>{<option className='' value="" selected={filterStands.status === '' && true || false}>Статус </option>}
                                {standStatuses.map((type, index) => <option id={index} value={type[0]}>{type[1]}</option>)}</>}
                            {loadingStands === 'error' && <>{<option value="" selected={filterStands.status === '' && true || false}>Бекенд отвалился</option>}</>}
                        </select>
                        <select className='filter adaptive' adaptive onChange={e => setFilterStands({ ...filterStands, status: e.target.value })}>
                            {loadingStands === 'loaded' && <>{<option className='' value="" selected={filterStands.status === '' && true || false}>Источник </option>}
                                {sourceTypes.map((type, index) => <option id={index} value={type}>Conflunce PageId</option>)}</>}
                            {loadingStands === 'error' && <>{<option value="" selected={filterStands.status === '' && true || false}>Бекенд отвалился</option>}</>}
                        </select>
                        {/* <input type="text" className="filter" placeholder="Текст записи" onChange={e => setFilterStands({ ...filterStands, note: e.target.value })} value={filterStands.note} /> */}
                    </Filter>
                </div>

                {loadingStands === 'loading' && <p> Loading ...</p>}
                {loadingStands === 'error' && <p> бекенд отвалился</p>}
                {loadingStands === 'loaded' && stands.length == 0 && <> <p>Пока не добавлено ни одного стенда</p></>}
                {loadingStands === 'loaded' && <>
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
