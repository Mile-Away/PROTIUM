import { PlusIcon } from '@heroicons/react/24/outline';
const team = [
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Whitney Francis',
    email: 'whitney.francis@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Leonard Krasner',
    email: 'leonard.krasner@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Floyd Miles',
    email: 'floyd.miles@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Emily Selman',
    email: 'emily.selman@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

interface MembersRadiosProps {
  value: string;
  handleChange: (value: string) => void;
}

const MembersRadios = ({ value, handleChange }: MembersRadiosProps) => {
  return (
    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
      <div>
        <h3 className="text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-50">
          Administrators
        </h3>
      </div>
      <div className="space-y-5 sm:col-span-2">
        <div className="relative flex items-start">
          <div className="absolute flex h-6 items-center">
            <input
              id="administrators"
              name="administrators"
              aria-describedby="public-access-description"
              type="radio"
              value="default"
              defaultChecked
              className="h-4 w-4 border-neutral-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="w-full pl-7 text-sm leading-6">
            <div className=" flex items-start justify-between gap-8">
              <label
                htmlFor="public-access"
                className="font-medium text-neutral-900 dark:text-neutral-50"
              >
                Default
              </label>
              <div className="flex space-x-2">
                {/* {team.map((person) => (
                  <a
                    key={person.email}
                    href={person.href}
                    className="flex-shrink-0 rounded-full hover:opacity-75"
                  >
                    <img
                      className="inline-block h-6 w-6 rounded-full"
                      src={person.imageUrl}
                      alt={person.name}
                    />
                  </a>
                ))} */}

                {/* <button
                  type="button"
                  className="relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-2" />
                  <span className="sr-only">Add team member</span>
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </button> */}
              </div>
            </div>

            <p id="public-access-description" className="text-neutral-500">
              The default administrator is the creator of the discussion and the
              Space owner.
            </p>
          </div>
        </div>
        <div className="relative flex items-start">
          <div className="absolute flex h-6 items-center">
            <input
              id="administrators"
              name="administrators"
              aria-describedby="public-access-description"
              type="radio"
              className="h-4 w-4 border-neutral-300 text-indigo-600 focus:ring-indigo-600 dark:border-neutral-700 "
              disabled
            />
          </div>
          <div className="w-full pl-7 text-sm leading-6">
            <div className=" flex items-start justify-between gap-8">
              <label
                htmlFor="public-access"
                className="pointer-events-none font-medium text-neutral-400 dark:text-neutral-700"
              >
                Custom
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="relative inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500 dark:hover:border-neutral-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-0"
                >
                  <span className="absolute -inset-2" />
                  <span className="sr-only">Add team member</span>
                  <PlusIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <p
              id="public-access-description"
              className="text-neutral-400 dark:text-gray-700"
            >
              Not supported yet, will be soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersRadios;
