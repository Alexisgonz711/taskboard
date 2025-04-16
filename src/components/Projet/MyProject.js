import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../Sign/UserContext';
import { projetCollection } from '../../firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskEdit from './TaskEdit';
import AddTask from './AddTask';
import TaskCard from '../Card/Card';
import Loading from '../Loading/Loading';

/**
 * Composant qui affiche les détails d'un projet et permet de gérer ses tâches.
 *
 * @returns {JSX.Element} Le composant MyProject.
 */
function MyProject() {
   const { id: projectId } = useParams();
   const user = useUser();
   const [projectData, setProjectData] = useState(null);
   const [selectedTask, setSelectedTask] = useState(null);
   const [showAddTask, setShowAddTask] = useState(false);
   const [activeColumn, setActiveColumn] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isOwner, setIsOwner] = useState(false);

   const toggleAddTask = useCallback((category) => {
      setShowAddTask(!showAddTask);
      setActiveColumn(category);
   }, [showAddTask]);

   const categoryLabels = {
      aFaire: 'À faire',
      enCours: 'En cours',
      fait: 'Terminé',
   };

   const initialCategoriesOrder = [
      { category: 'aFaire', order: 1 },
      { category: 'enCours', order: 2 },
      { category: 'fait', order: 3 },
   ];

   const getCategoryLabel = useCallback((categoryKey) => {
      return categoryLabels[categoryKey] || categoryKey;
   }, []);

   const checkUserPermissions = useCallback((projectData) => {
      if (!user || !projectData) return false;
      const isOwner = projectData.owner === user.uid;
      setIsOwner(isOwner);
      return isOwner;
   }, [user]);

   useEffect(() => {
      const fetchProjectData = async () => {
         try {
            if (user && projectId) {
               const projectDocRef = doc(projetCollection, projectId);
               const projectDocSnapshot = await getDoc(projectDocRef);

               if (projectDocSnapshot.exists()) {
                  const data = projectDocSnapshot.data();
                  if (
                     data.owner === user.uid ||
                     data.memberUIDs?.includes(user.uid) ||
                     data.members?.includes(user.email)
                  ) {
                     setProjectData(data);
                     checkUserPermissions(data);
                  } else {
                     setLoading(false);
                  }
               } else {
                  setLoading(false);
               }
            }
         } catch (error) {
            setLoading(false);
         } finally {
            setLoading(false);
         }
      };

      fetchProjectData();
   }, [user, projectId, checkUserPermissions]);

   const handleAddTask = useCallback(async (newTask) => {
      try {
         if (!newTask.title.trim()) {
            return;
         }

         const currentCategory = activeColumn || newTask.category;

         if (projectData.tasks.hasOwnProperty(currentCategory)) {
            const updatedTasks = [
               ...projectData.tasks[currentCategory],
               {
                  ...newTask,
                  id: Date.now(),
               },
            ];

            const updatedProjectData = {
               ...projectData,
               tasks: {
                  ...projectData.tasks,
                  [currentCategory]: updatedTasks,
               },
            };

            setProjectData(updatedProjectData);

            const projectDocRef = doc(projetCollection, projectId);
            await updateDoc(projectDocRef, updatedProjectData);
         }
      } catch (error) {
         // Erreur silencieuse
      }
   }, [activeColumn, projectData, projectId]);

   const onDragEnd = useCallback(async (result) => {
      if (!projectData || !projectData.memberUIDs?.includes(user.uid)) {
         return;
      }

      const { destination, source } = result;

      if (!destination) return;

      if (
         destination.droppableId === source.droppableId &&
         destination.index === source.index
      ) {
         return;
      }

      try {
         const sourceCategory = source.droppableId;
         const destinationCategory = destination.droppableId;

         if (sourceCategory === destinationCategory) {
            const tasks = [...projectData.tasks[sourceCategory]];
            const [movedTask] = tasks.splice(source.index, 1);
            tasks.splice(destination.index, 0, movedTask);

            const updatedProjectData = {
               ...projectData,
               tasks: {
                  ...projectData.tasks,
                  [sourceCategory]: tasks,
               },
            };

            setProjectData(updatedProjectData);
            const projectDocRef = doc(projetCollection, projectId);
            await updateDoc(projectDocRef, updatedProjectData);
            return;
         }

         const sourceTasks = [...projectData.tasks[sourceCategory]];
         const destinationTasks = [...projectData.tasks[destinationCategory]];
         const [movedTask] = sourceTasks.splice(source.index, 1);

         movedTask.category = destinationCategory;
         destinationTasks.splice(destination.index, 0, movedTask);

         const updatedProjectData = {
            ...projectData,
            tasks: {
               ...projectData.tasks,
               [sourceCategory]: sourceTasks,
               [destinationCategory]: destinationTasks,
            },
         };

         setProjectData(updatedProjectData);
         const projectDocRef = doc(projetCollection, projectId);
         await updateDoc(projectDocRef, updatedProjectData);
      } catch (error) {
         // Erreur silencieuse
      }
   }, [projectData, projectId, user?.uid]);

   const handleUpdateTask = async (updatedTask) => {
      if (!selectedTask?.category || !projectData?.tasks) return;

      try {
         const tasks = [...projectData.tasks[selectedTask.category]];
         const taskIndex = tasks.findIndex(task => task.id === selectedTask.id);

         if (taskIndex === -1) return;

         tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
         const updatedProjectData = {
            ...projectData,
            tasks: { ...projectData.tasks, [selectedTask.category]: tasks }
         };

         const projectDocRef = doc(projetCollection, projectId);
         await updateDoc(projectDocRef, updatedProjectData);
         setProjectData(updatedProjectData);
         setSelectedTask(null);
      } catch (error) {
         // Erreur silencieuse
      }
   };

   const handleDeleteTask = async (taskId) => {
      if (!isOwner || !selectedTask?.category || !projectData?.tasks) return;

      try {
         const tasks = projectData.tasks[selectedTask.category]
            .filter(task => task.id !== taskId);

         const updatedProjectData = {
            ...projectData,
            tasks: { ...projectData.tasks, [selectedTask.category]: tasks }
         };

         const projectDocRef = doc(projetCollection, projectId);
         await updateDoc(projectDocRef, updatedProjectData);
         setProjectData(updatedProjectData);
         setSelectedTask(null);
      } catch (error) {
         // Erreur silencieuse
      }
   };

   if (!projectData) {
      return <Loading />;
   }

   return (
      <div className="h-full flex flex-col">
         <div className="flex items-center h-16 px-4">
            <h1 className="text-3xl font-bold text-mirage-950">
               {projectData && projectData.name}
            </h1>
         </div>

         <div className="flex-1 p-6">
            <DragDropContext onDragEnd={onDragEnd}>
               <div className="flex gap-6 h-full overflow-x-auto">
                  {initialCategoriesOrder.map((categoryInfo) => {
                     const category = categoryInfo.category;
                     const tasks = projectData?.tasks?.[category] || [];

                     return (
                        <div key={category} className="flex-1 min-w-[300px]">
                           <div className="bg-white rounded-lg p-4 h-full border border-gray-200">
                              <h3 className="text-lg font-semibold text-mirage-900 mb-4">
                                 {getCategoryLabel(category)}
                              </h3>
                              <Droppable droppableId={category}>
                                 {(provided) => (
                                    <div
                                       ref={provided.innerRef}
                                       {...provided.droppableProps}
                                       className="space-y-3 min-h-[100px] overflow-y-visible"
                                    >
                                       {tasks.map((task, index) => (
                                          <Draggable
                                             key={task.id}
                                             draggableId={task.id.toString()}
                                             index={index}
                                          >
                                             {(provided, snapshot) => (
                                                <div
                                                   ref={provided.innerRef}
                                                   {...provided.draggableProps}
                                                   {...provided.dragHandleProps}
                                                   className={`${
                                                      snapshot.isDragging ? 'shadow-lg' : ''
                                                   }`}
                                                >
                                                   <TaskCard
                                                      task={task}
                                                      onEdit={() => setSelectedTask(task)}
                                                   />
                                                </div>
                                             )}
                                          </Draggable>
                                       ))}
                                       {provided.placeholder}
                                    </div>
                                 )}
                              </Droppable>
                              <button
                                 onClick={() => toggleAddTask(category)}
                                 className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-mirage-900 hover:bg-mirage-100 rounded-lg transition-colors duration-200"
                              >
                                 <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M12 4v16m8-8H4"
                                    />
                                 </svg>
                                 <span>Ajouter une tâche</span>
                              </button>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </DragDropContext>
         </div>

         {showAddTask && (
            <AddTask
               categoryLabels={categoryLabels}
               toggleAddTask={toggleAddTask}
               showAddTask={showAddTask}
               onAddTask={handleAddTask}
               activeColumn={activeColumn}
            />
         )}
         {selectedTask && (
            <TaskEdit
               task={selectedTask}
               onClose={() => setSelectedTask(null)}
               onUpdate={handleUpdateTask}
               onDelete={handleDeleteTask}
               showTask={selectedTask}
               isOwner={isOwner}
            />
         )}
      </div>
   );
}

export default MyProject;
