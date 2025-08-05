import React from "react";
import { useState, useEffect, useContext } from "react";
import "./Main.css";
import Button from "../Button/Button";
import { apiGetStands, apiGetStand } from "../../services/apiStands";
import StandCard from "../Stands/StandCard/StandCard";
import sendIcon from "./send.png"
import { useAuthContext } from "../../hooks/useAuthContext";


export default function Main() {
    const [loadingStands, setLoadingStands] = useState('loading')
    const [stands, setStands] = useState([])
    const [pickedStand, setPickedStand] = useState({ id: 'default', name: 'Стенд', source_type: '' })
    const [standInfo, setStandInfo] = useState({ description: '', html_layout: '' })

    const [commentText, setCommentText] = useState('');

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
        } catch (err) {
            setLoadingStands('error')
        }
    }

    function handleComment(event) {
        setCommentText(event.target.value)
    }

    useEffect(() => {
        getStands()
    }, [])

    return (
        <>
            <div className="mainStands">
                {loadingStands === 'loading' && <p> Loading ...</p>}
                {loadingStands === 'error' && <p> бекенд отвалился</p>}
                {loadingStands === 'loaded' && <>
                    {stands.map(stand =>
                        <StandCard id={stand.id}
                            name={stand.name}
                            picked={pickedStand['id'] === stand.id && true || false}
                            onClick={() => { setStandInfo({ description: '', html_layout: '' }); setPickedStand(stand); getStand(stand.id); console.log("---!", standInfo) }}>
                        </StandCard>)}
                </>}
            </div>

            {/* <div className="mainStandDescription">
                <h3>{pickedStand.name}</h3>
                <h3>{standInfo.name}</h3>
                <textarea
                    placeholder={pickedStand['id'] === 0 && 'Описание стенда' || ''}
                    className="mainStands"
                    value={standInfo.description || ''}
                    disabled={true}  ></textarea>
            </div> */}

            <div className="mainStandLayout">
                <h3>{pickedStand.name}</h3>
                <h3>{standInfo.name}</h3>
                {standInfo.html_layout && (
                    <div
                        dangerouslySetInnerHTML={{ __html: standInfo.html_layout }}
                    />
                )}
            </div>
            <>{console.log(pickedStand)}</>
            <>{console.log(standInfo.html_layout)}</>
            {/* <div className="mainComments">
                <h3>Комментарии</h3>
                <div className="mainCommentsHead">
                    <div>
                        <textarea
                            className="mainComments"
                            value={commentText}
                            onChange={handleComment}
                            placeholder="Введите комментарий"
                        />
                    </div>
                    <div>
                        <img src={sendIcon} alt="" className="sendIcon" />
                    </div>
                </div>
                <div className="mainCommentsList">
                    комментарии
                </div>
            </div> */}
        </>
    );
}
