import "./EnvelopeFocus.css";

export default function EnvelopePreview({ onOpen }) {
  const stopPageInteraction = (event) => {
    event.stopPropagation();
  };

  const openEnvelope = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onOpen?.();
  };

  return (
    <button
      type="button"
      className="envelope-preview"
      onClick={openEnvelope}
      onPointerDown={stopPageInteraction}
      onPointerUp={openEnvelope}
      onMouseDown={stopPageInteraction}
      onTouchStart={stopPageInteraction}
      aria-label="Open the sealed envelope"
    >
      <span className="envelope-preview__shadow" />
      <span className="envelope-preview__paper">
        <span className="envelope-preview__fold envelope-preview__fold--left" />
        <span className="envelope-preview__fold envelope-preview__fold--right" />
        <span className="envelope-preview__flap" />
        <span className="envelope-preview__tape" aria-hidden="true" />
      </span>
    </button>
  );
}
