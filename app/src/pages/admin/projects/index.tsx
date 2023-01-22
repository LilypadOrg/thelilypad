import { NextPage } from 'next';
import Link from 'next/link';
import PageTitle from '~/components/ui/PageTitle';
import useAdmin from '~/hooks/useAdmin';
import { trpc } from '~/utils/trpc';
import { MdDeleteOutline } from 'react-icons/md';
import { MdOutlineModeEdit } from 'react-icons/md';
import { MdDoneOutline } from 'react-icons/md';
import DeleteProjectModal from '~/components/modals/DeleteProjectModal';
import { useState } from 'react';
import { Project } from '~/types/types';

const AdminProjectsPage: NextPage = () => {
  useAdmin();

  const { data: project, isLoading } = trpc.useQuery(['projects.all']);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProject, setDeleteProject] = useState<Project>();

  const handleDelete = (project: Project) => {
    setDeleteProject(project);
    setShowDeleteModal(true);
  };

  return (
    <>
      <DeleteProjectModal
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        project={deleteProject}
      />
      <PageTitle title="Admin Projects" />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          {project?.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>
                <Link href={`/projects/${project.id}/${project.content.slug}}`}>
                  <a>{project.content.title}</a>
                </Link>
              </td>
              <td>
                <button className="text-2xl text-secondary-400">
                  <MdDoneOutline />
                </button>
              </td>
              <td>
                <button className="text-2xl text-primary-400">
                  <MdOutlineModeEdit />
                </button>
              </td>
              <td>
                <button className="text-2xl text-red-500">
                  <MdDeleteOutline onClick={() => handleDelete(project)} />
                </button>
              </td>
            </tr>
          ))}
        </table>
      )}
    </>
  );
};

export default AdminProjectsPage;
