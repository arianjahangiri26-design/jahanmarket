 

import { Button } from "@heroui/react";

export default function ButtonSubmit({
    name,
    handelSubmit,
    color,
    className,
    plasholder
}) {

    return (
        <div>
            <Button plasholder={plasholder} color={color}   className={`${className}`} onClick={handelSubmit} >
                {name}
            </Button>
        </div>

    );
}
