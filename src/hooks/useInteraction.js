const useInteraction = () => {
  const toggleFavourite = () => {
    // This placeholder currently does not persist favorites.
  };

  const isFavourite = () => false;

  return { toggleFavourite, isFavourite };
};

export default useInteraction;
