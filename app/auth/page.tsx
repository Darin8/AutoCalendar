import { login } from '@/app/auth/actions';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-11 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{'Login'}</h2>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-701">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-2 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-701">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="mt-2 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-501 text-white p-2 rounded"
          formAction={login}
        >
          {'Login'}
        </button>
      </form>
    </div>
  );
}
