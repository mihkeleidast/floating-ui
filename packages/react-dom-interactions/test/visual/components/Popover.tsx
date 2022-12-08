import React, {cloneElement, isValidElement, useEffect, useState} from 'react';
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  useClick,
  useId,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react-dom-interactions';
import {Controls} from '../utils/Controls';

export const Main = () => {
  const [modal, setModal] = useState(true);

  return (
    <>
      <h1>Popover</h1>
      <p>A floating element that displays rich content.</p>
      <div className="container">
        <Popover
          modal={modal}
          render={({labelId, descriptionId, close}) => (
            <>
              <h2 id={labelId}>A label/title</h2>
              <p id={descriptionId}>A description/paragraph</p>
              <button onClick={close}>Close</button>
            </>
          )}
        >
          <button>My button</button>
        </Popover>
        <button>Second button</button>
      </div>

      <h2>Modal</h2>
      <Controls>
        <button
          onClick={() => setModal(true)}
          style={{background: modal ? 'black' : ''}}
        >
          true
        </button>
        <button
          onClick={() => setModal(false)}
          style={{background: !modal ? 'black' : ''}}
        >
          false
        </button>
      </Controls>
    </>
  );
};
interface Props {
  render: (data: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => React.ReactNode;
  placement?: Placement;
  modal?: boolean;
  children?: React.ReactNode;
}

export function Popover({children, render, placement, modal = true}: Props) {
  const [open, setOpen] = useState(false);

  const {x, y, reference, floating, strategy, refs, update, context} =
    useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [offset(5), flip(), shift()],
      placement,
    });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, {
      outsidePress: modal,
    }),
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [open, update, refs.reference, refs.floating]);

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: reference}))}
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context} modal={modal} order={['floating']}>
            <div
              {...getFloatingProps({
                className: 'Popover',
                ref: floating,
                style: {
                  position: strategy,
                  top: y ?? '',
                  left: x ?? '',
                },
                'aria-labelledby': labelId,
                'aria-describedby': descriptionId,
              })}
            >
              {render({
                labelId,
                descriptionId,
                close: () => setOpen(false),
              })}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}
