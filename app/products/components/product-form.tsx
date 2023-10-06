"use client"

import { Product } from "@/types/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string({  required_error: "Name is required"}).min(4),
  description: z.string().max(250),
  price: z.coerce.number({  required_error: "Price is required"}).min(1),
  sizeId: z.string().min(1),
  category_ids: z.string({  required_error: "At least one category is required"}).array(),
  image_ids: z.string({  required_error: "At least one category is required"}).array(),
  is_featured: z.boolean().default(false).optional(),
  is_archived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
    initialData: Product &  {
        images: string[]
      } | null;
      categories: string[];
      colors: string[];
      sizes: string[];
      price:number
  }



export const ProductForm: React.FC<ProductFormProps>=({
  initialData,
 
}) => {

  const params = useParams();
  const router = useRouter();

//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? 'Edit a product.' : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';
    

  const defaultValues = initialData ? {
    ...initialData,
    price: parseFloat(String(initialData?.price)),
  } : {
    name: '',
    description:"", 
    image_ids: [],
    price: 0,
    category_ids: [],
    colorId: '',
    sizeId: '',
    isFeatured: false,
    isArchived: false,
  }


  const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
      })

      const onSubmit = async (data: BillboardFormValues) => {
        try {
          setLoading(true);
          if (initialData) {
            await axios.patch(
              `/api/v1/${params.storeId}/billboards/${params.billboardId}`,
              data
            );
          } else {
            await axios.post(`/api/v1/${params.storeId}/billboards`, data);
          }
          router.refresh();
          router.push(`/${params.storeId}/billboards`);
          toast.success(toastMessage);
        } catch (error: any) {
          toast.error("Something went wrong.");
        } finally {
          setLoading(false);
        }
      };
    
      const onDelete = async () => {
        try {
          setLoading(true);
          await axios.delete(
            `/api/v1/${params.storeId}/billboards/${params.billboardId}`
          );
          router.refresh();
          router.push(`/${params.storeId}/billboards`);
          toast.success("Billboard deleted.");
        } catch (error: any) {
          toast.error(
            "Make sure you removed all categories using this billboard first."
          );
        } finally {
          setLoading(false);
          setOpen(false);
        }
      };
    
      return (
        <>
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
          />
          <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            {initialData && (
              <Button
                disabled={loading}
                variant="destructive"
                size="sm"
                onClick={() => setOpen(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Separator />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <div className="md:grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Billboard label"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          defaultSrc={initialData?.image_path}
                          value={field.value}
                          disabled={loading}
                          onChange={(url) => field.onChange(url)}
                          onRemove={() => field.onChange("")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
    
              <Button disabled={loading} className="ml-auto" type="submit">
                {action}
              </Button>
            </form>
          </Form>
        </>
      );
    };

}