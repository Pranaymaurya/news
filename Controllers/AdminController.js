import Project from "../Models/ProjectModel.js";
import User from "../Models/UserModel.js"; // Assuming you have a User model

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const newProject = new Project({
      title,
      description,
      deadline,
      assignedTo: [], // Initialize with an empty array
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

// Get all projects
export const getAllproject = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const projects = await User.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

export const takeProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user?.userId;

    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Fetch the project from the database
    const project = await Project.findById(projectId);

    // If the project doesn't exist, return an error
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if the user has already taken the project
    if (project.assignedTo.includes(userId)) {
      // If the user is already assigned to this project, return a message
      return res.status(400).json({ message: 'You have already taken this project.' });
    }

    // If the user hasn't taken the project yet, assign the user to the project
    project.assignedTo.push(userId);  // Add the userId to the assignedTo array
    project.status = 'Taken';  // Update the project's status to 'Taken'

    // Save the updated project to the database
    await project.save();

    // Respond with a success message and the updated project details
    return res.status(200).json({ message: 'Project taken successfully', project });
  } catch (error) {
    // If there's an error during the process, log it and return an error message
    console.error(error);
    res.status(500).json({ message: 'Error taking project', error: error.message });
  }
};



const calculateScore = (status) => {
  switch (status) {
    case 'Completed':
      return 50;
    case 'In Progress':
      return 20;
    case 'Taken':
      return 10;
    default:
      return 0;
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (!project.assignedTo.includes(userId)) {
      return res.status(403).json({ message: 'You are not authorized to update this project.' });
    }

    const { status } = req.body;
    if (!status || !['Open', 'Taken', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Please provide a valid status.' });
    }

    project.status = status;

    if (status) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const score = calculateScore(status);
      user.totalScore = score;

      await user.save();
    }

    await project.save();
    
    res.status(200).json({
      message: 'Project status updated successfully',
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating project status', error: error.message });
  }
};
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user?.userId; // Assuming userId is stored in the token

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Find all projects where the user is assigned
    const tasks = await Project.find({ assignedTo: userId });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user.' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Error fetching user tasks', error: error.message });
  }
};
// Calculate score based on the project status
export const getScoreByStatus = (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Open', 'Taken', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Please provide a valid status.' });
    }

    // Calculate the score
    const score = calculateScore(status);

    // Return the score
    res.status(200).json({ message: 'Score calculated successfully', score });
  } catch (error) {
    console.error('Error calculating score:', error);
    res.status(500).json({ message: 'Error calculating score', error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id; // Extract the project ID from the URL parameters
    
    // Check if the project ID is valid
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    //console.log('Project ID received:', projectId); // Log the project ID to the server console

    // Find the project by ID in the database
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // If the project is found, send it as a response
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};
export const role=async(req,res)=>{
  try {
    const userId = req.user?.userId; // Extracted from the token
    const user = await User.findById(userId); // Fetch user from the database
    console.log(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ role: user.role }); // Assuming the user model has a 'role' field
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Server error.' });
  }
}