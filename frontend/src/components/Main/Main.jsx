import React from "react";
import { useState, useEffect, useContext } from "react";
import "./Main.css";
import { apiGetStands, apiGetStand } from "../../services/apiStands";
import StandCard from "../Stands/StandCard/StandCard";
import sendIcon from "./send.png"
import { useAuthContext } from "../../hooks/useAuthContext";
import { Beba } from "./beba";

export default function Main() {
    const [loadingStands, setLoadingStands] = useState('loading')
    const [stands, setStands] = useState([])
    const [pickedStand, setPickedStand] = useState({ id: 'default', name: 'Стенд', source_type: '' })
    const [standInfo, setStandInfo] = useState({ description: '', page_layout: '' })
    const [renderedElement, setRenderedElement] = useState(false)

    const [commentText, setCommentText] = useState('');

    async function getStands() {
        try {
            console.log('getStands start!')
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

    function handleComment(event) {
        setCommentText(event.target.value)
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


    const MainStandLayOutValue = renderFromJson(standInfo.page_layout)

    useEffect(() => {
        getStands()
    }, [])
    return (
        <>
            {/* {standInfo.page_layout} */}
            {/* <ColorSchemeSelector></ColorSchemeSelector> */}
            {/* {console.log(typeof (standInfo.page_layout[3]))} */}
            <div className="mainLeftContainer">
                {loadingStands === 'loading' && <p> Loading ...</p>}
                {loadingStands === 'error' && <p> бекенд отвалился</p>}
                {loadingStands === 'loaded' && stands.length == 0 && <> <p>Пока не добавлено ни одного стенда</p></>}
                {loadingStands === 'loaded' && <>
                    {stands.map(stand =>
                        <StandCard
                            key={stand.id}
                            id={stand.id}
                            name={stand.name}
                            picked={pickedStand['id'] === stand.id && true || false}
                            // onClick={() => { getStand(stand.id); setPickedStand(stand); console.log("кнопка") }}>
                            // onClick={() => { getStand(stand.id); setPickedStand(stand); console.log("кнопка") }}>
                            onClick={() => {
                                getStand(stand.id).then(() => setPickedStand(stand));
                            }}>
                        </StandCard>)}
                </>}
            </div>
            <div className="mainRightContainer">

                <div className="mainStandLayout">
                    {/* {standInfo.page_layout && (
                        <div
                            dangerouslySetInnerHTML={{ __html: standInfo.page_layout }}
                        />
                    )} */}

                    {/* {standInfo.page_layout} */}
                    {standInfo.name && (standInfo.name) || <p>пусто</p>}
                    {console.log('in mainStandLayout', standInfo)}
                    {standInfo.description && (standInfo.description) || <p>пусто</p>}
                    {renderFromJson(standInfo.page_layout[0])}
                    {renderFromJson(standInfo.page_layout[1])}
                    {renderFromJson(standInfo.page_layout[2])}
                    {/* {typeof (standInfo.page_layout) == Object && <p>bibas</p>} */}

                </div>
                {/* {standInfo && standInfo.page_layout && (
                    <div className="layoutRender">
                        {renderFromJson(standInfo.page_layout)}
                        </div>
                        )} */}
                {/* <div className="mainStandDescription">
                            {standInfo.page_layout && (standInfo.page_layout) || <></>}
        
                        </div> */}
                <div className="mainStandDescription">
                    {standInfo.description && (standInfo.description) || <></>}

                </div>
            </div>

        </>
    );
}
