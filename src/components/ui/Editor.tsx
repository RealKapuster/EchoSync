// Import React dependencies.
import React, { useState, useCallback } from 'react';
// Import the Slate editor factory.
import { createEditor, Transforms, Editor as SlateEditor, Descendant  } from 'slate';

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history';

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string; bold?: true }

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
        Element: CustomElement
        Text: CustomText
    }
}

const emoji = require('node-emoji');

const Editor = ({transcript}: {transcript: string}) => {
    const [editor] = useState(() => withReact(createEditor()));
    
    const initialValue:Descendant[] = [
        {
          type: 'paragraph',
          children: [{ text: emoji.emojify(transcript) }],
        },
    ]
    
    return (
        <div className='p-6 border-solid border-2 border-slate-300 rounded-md'>
            <Slate editor={editor} value={initialValue}>
                <Editable></Editable>
            </Slate>
        </div>
    )
}

export default Editor
