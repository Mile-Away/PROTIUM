export const StarIcon: React.FC<{ filled: 'full' | 'half' | 'empty' }> = ({
  filled,
}) => {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="halfStarMask">
          <rect x="0" y="0" width="10" height="20" fill="white" />
          <rect x="10" y="0" width="10" height="20" fill="black" />
        </mask>
      </defs>
      <path
        d="M10 13.7384L13.8229 16.1772C14.4782 16.6346 15.3586 16.0921 15.2138 15.3021L14.2797 11.1936L17.5961 8.53993C18.1973 8.08706 17.975 6.96954 17.1994 6.89249L13.1021 6.50404L11.2681 2.64196C10.9677 1.89163 9.96034 1.89163 9.66196 2.64196L7.82788 6.49593L3.71751 6.88438C2.94191 6.96143 2.72779 8.07895 3.32106 8.53182L6.63743 11.1936L5.70327 15.3021C5.55854 16.0921 6.43094 16.6427 7.09433 16.1772L10 13.7384Z"
        fill="currentColor"
        className={`${
          filled === 'empty'
            ? 'stroke-neutral-400 text-transparent dark:stroke-neutral-500'
            : 'text-yellow-500 dark:text-yellow-400'
        }`}
        mask={filled === 'half' ? 'url(#halfStarMask)' : undefined}
      />
    </svg>
  );
};

const renderStarRating = (rating: number) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      <div className="mr-1 text-sm font-semibold">{rating}</div>
      {[...Array(filledStars)].map((_, index) => (
        <StarIcon key={`filled-${index}`} filled="full" />
      ))}
      {hasHalfStar && <StarIcon key="half" filled="half" />}
      {[...Array(emptyStars)].map((_, index) => (
        <StarIcon key={`empty-${index}`} filled="empty" />
      ))}
    </div>
  );
};

export default renderStarRating;
