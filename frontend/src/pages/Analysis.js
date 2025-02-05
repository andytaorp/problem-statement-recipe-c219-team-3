const Analysis = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div>
      <h2>Nutrition Analysis</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Image:</label>
          <input type="file" id="foodImg"/>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Analysis