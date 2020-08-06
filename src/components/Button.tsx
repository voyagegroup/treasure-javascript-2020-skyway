import * as React from 'react'
import styled from 'styled-components'

const Button = styled.span`
  cursor: pointer;
  color: transparent;
  text-shadow: 0 0 0 gray;
`

interface IconButtonProps {
  emoji: number;
  handleClick(): void
}

const IconButton: React.FC<IconButtonProps> = ({ emoji, handleClick }) => {

  return (
    <Button onClick={handleClick}>
        { String.fromCodePoint(emoji)}
    </Button>
  )
}

export default IconButton
