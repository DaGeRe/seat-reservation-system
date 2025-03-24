import './FloorImage.css';
import {IconButton, Tooltip, tooltipClasses} from '@mui/material';
import { styled } from '@mui/material/styles';
import firstFloorImage from '../Assets/firstfloor.png';
import secondFloorImage from '../Assets/secondfloor.png';
import firstFloorC from '../Assets/bautzner_19_c_1.png';
import secondFloorC from '../Assets/bautzner_19_c_2.png';
import thirdFloorC from '../Assets/bautzner_19_c_3.png';
import atticZwickau from '../Assets/Grundriss_AS-Zwickau.png';
import firstAtticBautzen from '../Assets/Außenstelle Bautzen/1. Dachgeschoss.png';
import secondAtticChmenitz from '../Assets/Belegungsplan AS_C_2_OG_01.png';
import fourthAtticChmenitz from '../Assets/Belegungsplan AS_C_4_OG_01.png';
import secondAtticLeipzig from '../Assets/Belegungsplan_AS_Leipzig.png';
import React, {useEffect, useCallback } from 'react';
import LaptopIcon from '@mui/icons-material/Laptop';
import {getRequest} from '../RequestFunctions/RequestFunctions';
import FloorSelector from '../FloorSelector.js';
import { GROUND, FOURTH_ATTIC, FIRST, SECOND, BAUTZNER_STR_19_A_B, BAUTZNER_STR_19_C, ZWICKAU, CHEMNITZ, LEIPZIG, SECOND_ATTIC, ATTIC, FIRST_ATTIC, BAUTZEN } from '../../constants.js';
/**
 * @param floor The current floor. (either First or Ground)
 * @param headers The headers including the jwt.
 * @param clickedXPosition The x coordinate clicked on the map.
 * @param clickedYPosition The y coordinate clicked on the map.
 * @param setCurrentRoom A function that is executed if the user has clicked on an known room.
 * @param present_color The color (green, blue, ...) of the known rooms.
 * @returns The rendered map with known rooms and the option to add an room.
 */
export default function FloorImage(
    {
        floor, 
        setFloor,
        building,
        setBuilding,
        headers, 
        clickedXPosition, 
        clickedYPosition, 
        setCurrentRoom, 
        present_color = 'blue'
    }) {
    const [allRooms, setAllRooms] = React.useState([]);
    /* isHoveredOverOldRoom is true iff the mouse pointer is over an button that locates an known room on the map.*/
    const [isHoveredOverOldRoom, setIsHoveredOverOldRoom] = React.useState(false);
    const [x, setX] = React.useState(0.0);
    const [y, setY] = React.useState(0.0);
    const new_color = 'green';
    
    const getAllActiveRooms = useCallback(
        async () => {
            getRequest(
                `${process.env.REACT_APP_BACKEND_URL}/rooms`,
                headers,
                setAllRooms,
                () => {console.log('Failed to fetch all rooms in FloorImage.jsx.');}
            );
        },
        [headers, setAllRooms]
    );

    useEffect(() => {
        getAllActiveRooms();
    }, [getAllActiveRooms]);
    
    /** Set isHoveredOverOldRoom to true to indicate that the mousepointer is above an button that locates known room on the map.*/
    const handleMouseEnter = () => {
        setIsHoveredOverOldRoom(true);
    };
    
    /** Set isHoveredOverOldRoom to false to indicate that the mousepointer is not above an button that locates an known room on the map.*/
    const handleMouseLeave = () => {
        setIsHoveredOverOldRoom(false);
    };

    const handleMouseClick = (e) => {
        /**
         * We check if the mouse pointer is above an button that locates an known room on the map.
         * If so we ignore the mouseclick. This happens because otherwise the new room will be positioned
         * on an random place on the map. This behaviour is a bug and this is only a workaround.
         */
        if (isHoveredOverOldRoom) {
            return;
        }
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; // X coordinate within the image
        const y = e.clientY - rect.top; // Y coordinate within the image
        const xPercent =  (x/rect.width)*100; 
        const yPercent =  (y/rect.height)*100;
        if (clickedXPosition) {
            setX(xPercent);
            clickedXPosition(xPercent);
        }
        if (clickedYPosition) {
            setY(yPercent);
            clickedYPosition(yPercent);
        }
    }
    
    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
        ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));

        var floorImage = null;
        if (building === BAUTZNER_STR_19_A_B) {
            if (floor === GROUND)
                floorImage = firstFloorImage;
            else if (floor === FIRST)
                floorImage = secondFloorImage;
        }
        else if (building === BAUTZNER_STR_19_C) {
            if (floor === GROUND)
                floorImage = firstFloorC;
            else if (floor === FIRST)
                floorImage = secondFloorC;
            else if (floor === SECOND) {
                floorImage = thirdFloorC;
            }
        }
        else if (building === ZWICKAU) {
            if (floor === ATTIC)
                floorImage = atticZwickau;
        }
        else if (building === CHEMNITZ) {
            if (floor === SECOND_ATTIC) {
                floorImage = secondAtticChmenitz;
            }
            else if (floor === FOURTH_ATTIC) {
                floorImage = fourthAtticChmenitz;
            }
        }
        else if (building === LEIPZIG) {
            if (floor === SECOND_ATTIC)
                floorImage = secondAtticLeipzig;
        }
        else if (building === BAUTZEN) {
            if (floor === FIRST_ATTIC)
                floorImage = firstAtticBautzen;
        }

        return (
            <>
                <FloorSelector
                    floor={floor}
                    setFloor={setFloor}
                    building={building}
                    setBuilding={setBuilding}
                />
                <br></br> <br></br>
                {floorImage && (
                    
                    <div className='image-container' onMouseDown={handleMouseClick}>
                        {/* Floor Image */}
                        <img src={floorImage} alt='floorImage' className='floor-image' 
                            style={{ maxWidth: '100%', maxHeight: '600px' }} 
                        />

                            {/* Conditional render for specific coordinates */}
                            {x !== 0.0 && y !== 0.0 && (
                                <div
                                    className="image-icon"
                                    style={{
                                        top: `${y}%`,
                                        left: `${x}%`
                                    }}
                                >
                                    <IconButton>
                                        <LaptopIcon 
                                            style={{ 
                                                color: new_color, 
                                                fontSize: '24px' 
                                            }}
                                            className='image-icon-new'
                                        />
                                    </IconButton>
                                </div>
                            )}
        
                            {/* Render icons for all rooms matching the current floor */}
                            {
                                allRooms
                                .filter(room => room.floor === floor && room.building === building)
                                .map((room, i) => (
                                    <div
                                        key={i}
                                        className='image-icon'
                                        
                                        style={{
                                            top: `${room.y}%`,
                                            left: `${room.x}%`
                                        }}
                                    >
                                        <HtmlTooltip
                                            title={
                                                <React.Fragment>
                                                    <em>{room.remark}</em>
                                                </React.Fragment>
                                            }
                                        >
                                        <IconButton
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            id={`icon_button_${room.remark}`}
                                            onClick={() => setCurrentRoom && setCurrentRoom(room)}
                                        >
                                            <LaptopIcon
                                                style={{ 
                                                    color: present_color, 
                                                    fontSize: '24px' 
                                                }}
                                                id={`icon_${room.remark}`}
                                                className='image-icon-old'
                                            />
                                        </IconButton>
                                    </HtmlTooltip>
                                </div>
                            ))}
                    </div>
                )}
            </>
        );        
    };
