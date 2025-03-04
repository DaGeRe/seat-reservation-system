select  
    distinct b1.series_id, 
    b2.series_id, 
    b1.booking_id, 
    b2.booking_id, 
    desks.remark, 
    b1.day, 
    u1.email,  
    u2.email,  
    b1.begin,  
    b1.end,  
    b2.begin,  
    b2.end  
from bookings b1  
join users u1 on b1.user_id=u1.id  
join desks on b1.desk_id=desks.desk_id  
join bookings b2 on b1.booking_id!=b2.booking_id  
join users u2 on b2.user_id=u2.id  
where  
    b1.desk_id = b2.desk_id  
    and ( 
        (b1.begin=b2.begin or b1.end=b2.end) 
        or (b1.begin between b2.begin and b2.end) 
        or (b1.end between b2.begin and b2.end) 
        or (b2.begin between b1.begin and b1.end) 
        or (b2.end between b1.begin and b1.end) 
    )  
    and b1.user_id<b2.user_id and b1.day=b2.day 
    and b1.day > curdate()
;