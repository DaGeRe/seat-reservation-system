import './FloorImage.css'; 
import {IconButton, Tooltip, tooltipClasses} from '@mui/material';
import { styled } from '@mui/material/styles';
import firstFloorImage from '../../images/firstfloor.png';
import secondFloorImage from '../../images/secondfloor.png'; 
import React, {useEffect, useCallback } from 'react';
import LaptopIcon from '@mui/icons-material/Laptop';
import {getRequest} from '../RequestFunctions/RequestFunctions';

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
    //const present_color = 'blue';
    const new_color = 'green';
    
    const getAllActiveRooms = useCallback(
        async () => {
            getRequest(
                //`${process.env.REACT_APP_BACKEND_URL}/rooms/status`,
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
/*             backgroundColor: '#000000',
            color: 'green', */
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
          },
      }));

    const floorImage = floor === 'Ground' ? firstFloorImage : secondFloorImage;

    return (
        <div
            className='image-container'
            onMouseDown={handleMouseClick}
        > 
            <img src={floorImage} alt='floorImage' className='floor-image' />
                {x !== 0.0 && y !== 0.0 && (
                    <div
                        className='image-icon'
                        style={{
                            top: `${y}%`,
                            left: `${x}%`
                        }}
                    >
                        <IconButton>
                            <LaptopIcon style={{ 
                                color: new_color, 
                                fontSize: '24px' 
                            }}
                                className='image-icon-new'
                            />
                        </IconButton>
                    </div>
            )}
            {
                allRooms
                .filter((room) => {
                  return room.floor === floor
                })
                .map((room, i) => {
                    return (
                        <div
                            key={i}
                            className='image-icon'
                            style={{
                                top:  `${room.y}%`,
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
                                    onClick={_ => {
                                        if (setCurrentRoom) {
                                            setCurrentRoom(room);
                                        }
                                        else {

                                        }
                                }}>
                                  <LaptopIcon
                                    style={{ 
                                        color: present_color, 
                                        fontSize: '24px',
                                    }}
                                    className='image-icon-old'
                                  />
                                </IconButton>      
                            </HtmlTooltip>   
                        </div>
                    )
                })
            }
        </div>
      );
    };
