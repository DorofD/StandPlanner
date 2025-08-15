import React, { Component, useState, useEffect } from "react";
import "./TestComponent.css"
import Loader from "../Loader/Loader";
import { notificationsExamples, shortTextRu, mediumTextRu, longTextRu } from "./TextExamples";
import { apiGetStand } from "../../services/apiStands";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import { useTimedMessagesContext } from "../../hooks/useTimedMessagesContext";

export default function TestComponent() {
    const { notificationData, setNotificationData, toggleNotificationFunc, notificationToggle } = useNotificationContext();
    const { messages, addMessage } = useTimedMessagesContext();
    const [count, setCount] = useState(0);
    const [testText, setTestText] = useState('');
    const [messageLength, setMessageLength] = useState('short')
    const [loaderActive, setLoaderActive] = useState(false)
    const [layOut, setLayOut] = useState([])

    async function showNotification(text, type) {
        setNotificationData({ message: text, type: type })
        toggleNotificationFunc()
    }

    function getRandomNotification() {
        return notificationsExamples[Math.floor(Math.random() * notificationsExamples.length)]
    }

    async function getStand(id) {
        try {
            console.log(id, "i'm here")
            const lStand = await apiGetStand(id)
            setLayOut(lStand.page_layout)
            // setIsChanged({ name: false, description: false })
        } catch (err) {
            setLoading('error')
        }
    }

    function getRandomTextRu() {
        if (testText) { return testText }
        if (messageLength === 'short') { return shortTextRu[Math.floor(Math.random() * shortTextRu.length)] }
        if (messageLength === 'medium') { return mediumTextRu[Math.floor(Math.random() * mediumTextRu.length)] }
        if (messageLength === 'long') { return longTextRu[Math.floor(Math.random() * longTextRu.length)] }
    }
    // function renderFromJson(node) {
    //     // Если это строка — просто возвращаем её как текстовый узел
    //     if (typeof node === 'string') return node;

    //     const { tag, children = [], attrs = {} } = node;
    //     // Рекурсивно рендерим детей
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

        // Текстовый узел
        if ('text' in node) return node.text;

        // Нет тега - нельзя создать элемент
        if (!('tag' in node)) return null;

        const { tag, children = [], attrs = {} } = node;

        // Обеспечиваем, что children - массив
        const childElements = Array.isArray(children)
            ? children.map(renderFromJson)
            : [renderFromJson(children)];

        return React.createElement(tag, attrs, ...childElements);
    }
    const json_layout = { "tag": "div", "children": [{ "tag": "div", "children": [{ "tag": "table", "children": [{ "tag": "colgroup", "children": [{ "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }, { "tag": "col" }] }, { "tag": "tbody", "children": [{ "tag": "tr", "children": [{ "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }, { "tag": "th" }] }, { "tag": "tr", "children": [{ "tag": "td", "children": [{ "tag": "span" }] }, { "tag": "td", "children": [{ "tag": "span" }] }, { "tag": "td", "children": [{ "tag": "div", "children": [{ "tag": "p", "children": [{ "tag": "span" }] }] }] }, { "tag": "td" }, { "tag": "td", "children": [{ "tag": "span" }] }, { "tag": "td" }, { "tag": "td", "children": [{ "tag": "span" }] }, { "tag": "td", "children": [{ "tag": "span" }] }, { "tag": "td" }, { "tag": "td" }, { "tag": "td", "children": [{ "tag": "div", "children": [{ "tag": "p", "children": [{ "tag": "div", "children": [{ "tag": "p", "children": [{ "tag": "div", "children": [{ "tag": "table", "children": [{ "tag": "tbody", "children": [{ "tag": "tr" }, { "tag": "tr", "children": [{ "tag": "th" }, { "tag": "th" }, { "tag": "th" }] }] }] }] }, { "tag": "div", "children": [{ "tag": "span", "children": [{ "tag": "span" }] }] }] }] }] }] }] }] }] }] }] }] }
    // useEffect(() => {
    //     getSchedulerInfo()
    // }, [])

    return (
        <div className="testComponentMain">
            {loaderActive && <Loader />}
            <div className="testComponentSection">
                {layOut && layOut.page && (
                    <div className="layoutRender">
                        {renderFromJson(layOut)}
                    </div>
                )}
                <div className="testFilterContainer1">
                    <div className="testFilterContainerPart">

                        <div className="testLengthSelector">
                            <p>Длина тестовых сообщений</p>
                            <select className='testSelect' onChange={e => setMessageLength(e.target.value)}>
                                <option value="short" selected={messageLength == 'short' && true || false}>short</option>
                                <option value="medium" selected={messageLength == 'medium' && true || false}>medium</option>
                                <option value="long" selected={messageLength == 'long' && true || false}>long</option>
                            </select>
                        </div>
                    </div>
                    <div className="testFilterContainerPart">
                        <button onClick={() => setLoaderActive((prev) => !prev)}>Loader</button>
                    </div>
                    <div className="testFilterContainerPart">
                        <button onClick={() => { getStand(1) }}>Стенд ТНИ2 Leg2 #2 (состав УРЛС)</button>
                        <button onClick={() => { getStand(2) }}>Стенд ТНИ2 SSD2 #4</button>
                    </div>
                    <div className="testFilterContainerPart">

                    </div>
                </div>
                <div className="testContainerLeft">
                    <div className="testContainerLeft2">
                        <textarea name="testComponent" id="test"
                            placeholder='Текст уведомлений'
                            className="testComponent"
                            value={testText}
                            onChange={e => setTestText(e.target.value)}
                        ></textarea>

                        <button onClick={() => showNotification(getRandomTextRu(), 'success')}>Notification success</button>
                        <button onClick={() => showNotification(getRandomTextRu(), 'info')}>Notification info</button>
                        <button onClick={() => showNotification(getRandomTextRu(), 'warning')}>Notification warning</button>
                        <button onClick={() => showNotification(getRandomTextRu(), 'error')}>Notification error</button>
                        <button onClick={() => addMessage(getRandomTextRu(), 'success')}>TimedMessage success</button>
                        <button onClick={() => addMessage(getRandomTextRu(), 'info')}>TimedMessage info</button>
                        <button onClick={() => addMessage(getRandomTextRu(), 'warning')}>TimedMessage warning</button>
                        <button onClick={() => addMessage(getRandomTextRu(), 'error')}>TimedMessage error</button>
                    </div>
                    <div className="testContainerLeft2"></div>
                </div>
            </div>
        </div>
    );
}