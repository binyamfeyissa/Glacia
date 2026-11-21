/**
 * The mobile components run in React Native, so the site does not fake them
 * in a browser. Each component page shows this phone frame where a recording
 * of the real component — filmed on a physical phone — will sit. Until the
 * recording lands, the frame says exactly that, and the page's props, code,
 * and notes below carry the full documentation.
 */
export function DevicePreview({ name }: { name: string }) {
  return (
    <div className="device-preview">
      <div className="device-preview-phone">
        <div className="device-preview-notch" aria-hidden />
        <div className="device-preview-screen">
          <span className="device-preview-name">{name}</span>
          <p className="device-preview-note">
            Filmed on a real phone.
            <br />
            The recording lands here at launch.
          </p>
          <div className="device-preview-chips">
            <span>iOS 26 · native glass</span>
            <span>iOS &lt; 26 · Glacia glass</span>
            <span>Android · Glacia glass</span>
          </div>
        </div>
      </div>
      <p className="device-preview-caption">
        React Native components are not rendered in the browser — what you see on a phone is
        the real thing, so that is what we show.
      </p>
    </div>
  );
}
