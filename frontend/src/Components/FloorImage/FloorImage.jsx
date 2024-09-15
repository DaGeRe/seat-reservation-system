
import './FloorImage.css'; 
import {IconButton, Tooltip, tooltipClasses} from '@mui/material';

import { styled } from '@mui/material/styles';
import firstFloorImage from '../../images/firstfloor.png';
import secondFloorImage from '../../images/secondfloor.png'; 
import React, {useEffect } from 'react';
import LaptopIcon from '@mui/icons-material/Laptop';

export default function FloorImage({floor, headers, clickedXPosition, clickedYPosition, setCurrentRoom}) {
    const [allRooms, setAllRooms] = React.useState([]);
    const [x, setX] = React.useState(0.0);
    const [y, setY] = React.useState(0.0);
    
    useEffect(() => {
        getAllRooms();
      }, []);
    
    async function getAllRooms(){
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/status`, {
            method: 'GET',
            headers: headers,
        }).then(resp => {
            resp.json().then(data => {
            setAllRooms(data);
            });
        }).catch(error => {
            console.log(error);
        });
        }

    const handleMouseClick = (e) => {
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

    const floorImage = floor === 'Ground' ? firstFloorImage : secondFloorImage;

    return (
        <div
            className='image-container'
            onMouseDown={handleMouseClick}
        > 
            <img src={floorImage} alt='Example' className='floor-image' />
                {x != 0.0 && y!= 0.0 && (
                    <div
                        className='image-icon'
                        style={{
                            top: `${y}%`,
                            left: `${x}%`
                        }}
                    >
                        <IconButton>
                            <LaptopIcon
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
{/*                                     <em>x: {room.x} y: {room.y}</em>
                                    <br></br> */}
                                    <em>{room.remark}</em>
                                  </React.Fragment>
                                }
                              >
                                <IconButton 
                                    onClick={_ => {
                                        if (setCurrentRoom) {
                                            setCurrentRoom(room);
                                        }
                                }}>
                                  <LaptopIcon
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
