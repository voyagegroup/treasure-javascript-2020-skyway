import * as React from 'react'
import styled from 'styled-components'
import { FieldHeight, FieldWidth } from '../utils/sizes'

const Wrapper = styled.div`
  height: ${FieldHeight}px;
  width: ${FieldWidth}px;
  background: lightgray;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`

const MessageWrapper = styled.div<{moveToRight: boolean}>`
  background: transparent;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: ${p => p.moveToRight ? 'flex-end' : 'flex-start'};
`

const Message = styled.div`
  display: block;
  background: green;
  color: white;
  border-radius: 20px;
  padding: 0 15px;
  margin: 5px 10px;
  max-width: 50%;
`

const MyMessage = styled(Message)`
  text-align: right;
`

const TheirMessage = styled(Message)`
  text-align: left;
`

interface Props {
  contents: {
    id: number;
    content: string;
  }[];
}

const Field: React.FC<Props> = ({ contents }) => {

  console.log(contents)
  return (
    <Wrapper>
      {
        contents.map(content => (
          <MessageWrapper moveToRight={content.id === 0} key={`${content.content}-${Math.random()}`}>
            {
              content.id === 0
              ?<MyMessage>
                  {
                    content.content.split('\n').map(str => (
                      <div key={`${str}-${Math.random()}`}>{str}</div>
                    ))
                  }
                </MyMessage>
              :<TheirMessage>
                  {
                    content.content.split('\n').map(str => (
                      <div key={`${str}-${Math.random()}`}>{str}</div>
                    ))
                  }
               </TheirMessage>
            }

          </MessageWrapper>
        ))
      }
    </Wrapper>
  )
}

export default Field
