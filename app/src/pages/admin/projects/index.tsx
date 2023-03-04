import { NextPage } from 'next';
import Link from 'next/link';
import PageTitle from '~/components/ui/PageTitle';
import useAdmin from '~/hooks/useAdmin';
import { trpc } from '~/utils/trpc';
import { MdDeleteOutline } from 'react-icons/md';
import { MdOutlineModeEdit } from 'react-icons/md';
import DeleteProjectModal from '~/components/modals/DeleteProjectModal';
import { useState } from 'react';
import { Project } from '~/types/types';
import Button from '~/components/ui/Button';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AdminProjectsPage: NextPage = () => {
  useAdmin();

  const utils = trpc.useContext();
  const { data: project, isLoading } = trpc.useQuery(
    ['projects.all', { visibility: 'All' }],
    {
      onSuccess: () => {
        utils.invalidateQueries(['projects.all', { visibility: 'All' }]);
      },
    }
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProject, setDeleteProject] = useState<Project>();

  const handleDelete = (project: Project) => {
    setDeleteProject(project);
    setShowDeleteModal(true);
  };

  const { mutate: setVisibility } = trpc.useMutation(['projects.setIsVisible']);

  const setProjectVisibility = async (project: Project) => {
    setVisibility({ id: project.id, isVisible: !project.isVisible });
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
          <tbody>
            {project?.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>
                  <Link
                    href={`/projects/${project.id}/${project.content.slug}}`}
                  >
                    <a>{project.content.title}</a>
                  </Link>
                </td>
                <td>
                  <Button
                    className="flex items-center gap-x-2"
                    variant="secondary"
                    subVariant="outline"
                    onClick={() => {
                      setProjectVisibility(project);
                    }}
                  >
                    {project.isVisible ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                    <p className="hidden sm:block">
                      {project.isVisible ? 'Hide' : 'Show'}
                    </p>
                  </Button>
                </td>
                <td>
                  <Link href={`/projects/edit/${project.id}`}>
                    <Button
                      className="flex items-center gap-x-2"
                      variant="primary"
                      subVariant="outline"
                    >
                      <MdOutlineModeEdit />
                      <p className="hidden sm:block">Edit</p>
                    </Button>
                  </Link>
                </td>
                <td>
                  <Button
                    className="flex items-center gap-x-2"
                    variant="danger"
                    subVariant="outline"
                  >
                    {' '}
                    <MdDeleteOutline onClick={() => handleDelete(project)} />
                    <p className="hidden sm:block">Delete</p>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default AdminProjectsPage;
