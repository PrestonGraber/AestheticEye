import { useCallback, useEffect, useRef } from 'react';

export function useModal(onDismiss) {
  const ref = useRef(null);
  const previousFocus = useRef(null);
  const previousOverflow = useRef('');
  const locked = useRef(false);
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;

  const release = useCallback(() => {
    if (!locked.current) return;
    document.body.style.overflow = previousOverflow.current;
    locked.current = false;
    dismiss.current?.();
    if (previousFocus.current?.isConnected) previousFocus.current.focus({ preventScroll: true });
  }, []);

  const show = useCallback(() => {
    if (!ref.current || ref.current.open) return;
    previousFocus.current = document.activeElement;
    previousOverflow.current = document.body.style.overflow;
    ref.current.showModal();
    locked.current = true;
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    if (ref.current?.open) ref.current.close();
    release();
  }, [release]);

  useEffect(() => () => release(), [release]);

  return {
    ref,
    show,
    close,
    dialogProps: {
      ref,
      onClose: release,
      onCancel: (event) => {
        event.preventDefault();
        close();
      },
      onClick: (event) => {
        if (event.target === event.currentTarget) close();
      },
    },
  };
}
