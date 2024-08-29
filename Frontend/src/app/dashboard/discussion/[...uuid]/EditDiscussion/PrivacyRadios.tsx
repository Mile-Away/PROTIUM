import { DiscussionProps } from '@/@types/space';
import { LinkIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
interface PrivacyRadiosProps {
  value: DiscussionProps['privacy'];
  handleChange: (value: string) => void;
}

const PrivacyRadios = ({ value, handleChange }: PrivacyRadiosProps) => {
  return (
    <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
      <legend className="sr-only">Privacy</legend>
      <div
        className="text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-50"
        aria-hidden="true"
      >
        Privacy
      </div>
      <div className="space-y-5 sm:col-span-2">
        <div className="space-y-5 sm:mt-0">
          <div className="relative flex items-start">
            <div className="absolute flex h-6 items-center">
              <input
                id="public"
                name="public"
                aria-describedby="public-access-description"
                type="radio"
                className="h-4 w-4 border-neutral-300 text-indigo-600 focus:ring-indigo-600"
                value="public"
                checked={value === 'public'}
                onChange={(e) => handleChange(e.target.value)}
              />
            </div>
            <div className="pl-7 text-sm leading-6">
              <label
                htmlFor="public"
                className="font-medium text-neutral-900 dark:text-neutral-50"
              >
                Public access
              </label>
              <p id="public-access-description" className="text-neutral-500">
                Everyone with the link will see this project
              </p>
            </div>
          </div>
          <div className="relative flex items-start">
            <div className="absolute flex h-6 items-center">
              <input
                id="apply"
                name="apply"
                aria-describedby="restricted-access-description"
                type="radio"
                value="apply"
                checked={value === 'apply'}
                onChange={(e) => handleChange(e.target.value)}
                className="h-4 w-4 border-neutral-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="pl-7 text-sm leading-6">
              <label
                htmlFor="apply"
                className="font-medium text-neutral-900
               dark:text-neutral-50"
              >
                Public access, but apply
              </label>
              <p
                id="apply"
                className="text-neutral-500"
              >
                Everyone with the link will see this discussion, but must apply
                to the administrator to chat.
              </p>
              <button className="hidden peer-checked:block">
                apply solve, - TBD
              </button>
            </div>
          </div>

          <div className="relative flex items-start">
            <div className="absolute flex h-6 items-center">
              <input
                id="privat"
                name="private"
                aria-describedby="private-access-description"
                type="radio"
                value="private"
                checked={value === 'private'}
                onChange={(e) => handleChange(e.target.value)}
                className="h-4 w-4 border-neutral-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="pl-7 text-sm leading-6">
              <label
                htmlFor="private"
                className="font-medium text-neutral-900 dark:text-neutral-50"
              >
                Private to Discussion Members
              </label>
              <p id="private-access-description" className="text-neutral-500">
                Only members of in the above step would be able to access this
                project
              </p>
            </div>
          </div>
        </div>
        {/* <hr className="border-neutral-200 dark:border-neutral-700" />
        <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <a
              href="#"
              className="group flex items-center space-x-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"
            >
              <LinkIcon
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-900 dark:group-hover:text-indigo-400"
                aria-hidden="true"
              />
              <span>Copy link</span>
            </a>
          </div>
          <div>
            <a
              href="#"
              className="group flex items-center space-x-2.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-400"
            >
              <QuestionMarkCircleIcon
                className="h-5 w-5 text-neutral-400 group-hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-400"
                aria-hidden="true"
              />
              <span>Learn more about pricacy</span>
            </a>
          </div>
        </div> */}
      </div>
    </fieldset>
  );
};

export default PrivacyRadios;
