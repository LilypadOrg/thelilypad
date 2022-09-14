
const EditProfileForm = () => {
  type Inputs = {
    username: string;
    bio: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (

  );
};

export default EditProfileForm;
