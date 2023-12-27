import React from 'react'
import { Button } from '@cred/neopop-web/lib/components';

const CredButton = (props) => {
  return (
    <Button
    textStyle={{ fontWeight: 'bold',fontSize:'20', fontType: 'Josefin Sans' }}
        variant="secondary"
        kind="elevated"
        size="big"
        colorMode="dark"
        onClick={() => {
            console.log("I'm clicked");
        }}
    >
        {props.Title}
    </Button>
);
}

export default CredButton