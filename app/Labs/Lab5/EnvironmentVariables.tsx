const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function EnvironmentVariables() {
  return (
    <div id="wd-environment-variables" className="mt-3">
      <h3>Environment Variables</h3>
      <p>Remote Server: {HTTP_SERVER}</p>
      <hr />
    </div>
  );
}
