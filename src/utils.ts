// Function to generate a random ID
export function generate() {
	// Define a subset of characters to use for the ID
	const subset = "123456789qwertyuiopasdfghjklzxcvbnm";
	
	// Set the length of the ID to be generated
	const length = 5;
	
	// Initialize an empty string to store the generated ID
	let id = "";
	
	// Loop 'length' number of times
	for (let i = 0; i < length; i++) {
		// Generate a random index within the range of the subset length
		const randomIndex = Math.floor(Math.random() * subset.length);
		
		// Add the character at the random index to the ID
		id += subset[randomIndex];
	}
	
	// Return the generated ID
	return id;
}
