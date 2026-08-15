import EnvelopePreview from "../../scene/EnvelopePreview";

export default function InsideCoverPage({
  showEnvelope = false,
  onEnvelopeOpen,
}) {
  return (
    <div className="inside-cover">
      <div className="inside-cover__aging" />
      {showEnvelope && <EnvelopePreview onOpen={onEnvelopeOpen} />}
    </div>
  );
}
