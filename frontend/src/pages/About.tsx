export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">About</h1>
      <p className="text-gray-600 mb-4">
        Welcome to my blog! This is a modern blog platform built with:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>React 18 with TypeScript</li>
        <li>Fastify backend API</li>
        <li>PostgreSQL database</li>
        <li>Docker for development</li>
        <li>Tailwind CSS for styling</li>
      </ul>
    </div>
  );
}