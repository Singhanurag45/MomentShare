// client/src/components/EmptyFeed.jsx

const EmptyFeed = () => {
  return (
    <div className="text-center bg-white border rounded-lg p-12 mt-6">
      <h2 className="text-2xl font-bold mb-2">Your Feed is Quiet</h2>
      <p className="text-gray-500">
        It looks like you haven't followed anyone yet, or the people you follow
        haven't posted.
        <br />
        Find new people to follow in the suggestions panel!
      </p>
    </div>
  );
};

export default EmptyFeed;
